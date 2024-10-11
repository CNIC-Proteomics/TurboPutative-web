import argparse
import os
import sys
import numpy as np
import pandas as pd
import json
import logging
from anova_analysis import get_anova_tukey
from mofapy2.run.entry_point import entry_point
import mofax as mfx
from functools import reduce

#
# Constants
#

#
# Local Functions
#

# Read the JSON formatted DataFrame
def read_dataframe(file_name):
    try:
        df = pd.read_json(file_name, orient='records')
        return df
    except FileNotFoundError:
        logging.error(f"The file '{file_name}' does not exist.")
        return None

# Perform PCA and save the results in JSON files
def apply_mofa(xi, myID, outfolder_path):
    
    #data_mat = [[xq.to_numpy()], [xm.to_numpy()]]
    data_mat = [[xi[i].to_numpy()] for i in xi]

    ent = entry_point()

    ent.set_data_options(
        scale_groups=False,
        scale_views=False,
        center_groups=False
    )

    ent.set_data_matrix(
        data=data_mat,
        #views_names=['q', 'm'],
        views_names=list(xi.keys()),
        #features_names=[xq.columns, xm.columns],
        features_names=[i.columns for i in xi.values()],
        samples_names=[myID],
        #likelihoods=['gaussian', 'gaussian']
        likelihoods=len(xi)*['gaussian']
    )

    ent.set_model_options(
        #factors=min(len(myID), xq.shape[1]+xm.shape[1]),
        factors=min(30, len(myID), sum([i.shape[1] for i in xi.values()])),
        spikeslab_factors=False,
        spikeslab_weights=True,
        ard_factors=False,
        ard_weights=True
    )

    ent.set_train_options(
        convergence_mode='fast',
        iter=10000,
        dropR2=0.015,
        gpu_mode=False,
        seed=0,
        verbose=False
        #outfile=os.path.join(outfolder_path, 'model.hdf5')
    )

    ent.build()
    ent.run()
    ent.save(outfile=os.path.join(outfolder_path, 'model.hdf5'))
    
    #
    # Extract from model the required data
    #
    model = mfx.mofa_model(os.path.join(outfolder_path, 'model.hdf5'))

    # loadings
    loadings = model.get_weights(df=True)

    loadings = {
        i: loadings.loc[xi[i].columns].to_dict()
        for i in xi
    }

    # explained variance
    explained_variance = dict(list(
        model.get_variance_explained().set_index('Factor')\
            .rename(columns={'R2': 'Explained_Variance'}).groupby('View')
    ))

    explained_variance = {
        i: explained_variance[i].drop(['View', 'Group'], axis=1).T.to_dict()
        for i in xi
    }

    # projections
    projections = pd.DataFrame(model.get_factors(),index=myID)
    projections.columns = [f'Factor{i+1}' for i in projections.columns]
    
    return projections, loadings, explained_variance

#
# Main
#

def main(args):
    
    #
    # Read tables
    #
    logging.info('Reading tables...')
    
    with open(args.index_path, 'r') as f:
        myIndex = json.load(f)
    logging.info(f'index file read: {args.index_path}')
        
    with open(args.mdata_type_path, 'r') as f:
        mdataType = json.load(f)
    logging.info(f'mdataType file read: {args.mdata_type_path}')

    xi = {}
    for xi_path, i in zip(args.xi_paths, args.omics):
        xi[i] = read_dataframe(xi_path)
        xi[i].index = myIndex[f'x{i}']
        logging.info(f'X{i} file read: {xi_path} read')
    
    mdata = read_dataframe(args.mdata_path)
    mdata.index = myIndex['mdata']
    logging.info(f'mdataType file read: {args.mdata_path}')
    

    #
    # Get only common observations
    #
    myID = reduce(lambda x, y: np.intersect1d(x,y), [i.index for i in xi.values()])
    myID = np.intersect1d(myID, mdata.index)
    xi = {
        i: xi[i].loc[myID]
        for i in xi
    }
    
    mdata = mdata.loc[myID]

    #
    # Add prefix to features of each omic to avoid repeated names (error in MOFA)
    #
    for i in xi:
        xi[i].columns = [f'_{i}_{f}' for f in xi[i].columns]
    
    #
    # Calculate MOFA
    #
    logging.info('Applying MOFA...')
    projections_df, loadings, explained_variance = apply_mofa(
        # xq,
        # xm,
        xi,
        myID,
        args.outfolder_path
        )
    logging.info("MOFA completed")

    #
    # Remove prefix from features at loadings
    #
    loadings = {
        omic: {
            factor: {
                f'{f[3:]}': loadings[omic][factor][f]
                for f in loadings[omic][factor]
            }
            for factor in loadings[omic]
            }
        for omic in loadings
        }

    #
    # Write MOFA output
    #
    logging.info('Writing MOFA output...')
    projections_df.to_json(os.path.join(args.outfolder_path, 'projections.json'), orient='index')

    with open(os.path.join(args.outfolder_path, 'loadings.json'), 'w') as f:
        json.dump(loadings, f)
    
    with open(os.path.join(args.outfolder_path, 'explained_variance.json'), 'w') as f:
        json.dump(explained_variance, f)


    #
    # Aplly ANOVA
    #     
    logging.info('Calculating ANOVA and Tukey-HSD...')
    anova_res = get_anova_tukey(projections_df, mdata, mdataType, args.outfolder_path)
    with open(os.path.join(args.outfolder_path, 'anova.json'), 'w') as f:
        json.dump(anova_res, f)
    logging.info("ANOVA and Tukey-HSD completed")
    
    return 0


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="""
    MOFA, ANOVA and Tukey-HSD analysis. 
        Exec example: 
            python mofa_anova_analysis.py
    """)
    
    parse_list = lambda x: x.split(',')

    parser.add_argument("--omics", type=parse_list, help="Comma-separated letters indicating working omic")
    parser.add_argument("--xi_paths", type=parse_list, help="Comma-separated paths to omics quantifications")

    parser.add_argument("--mdata_path", help="Path to metadata")
    parser.add_argument("--mdata_type_path", help="Path to metadata type")
    parser.add_argument("--index_path", help="Path to table indexes")
    parser.add_argument("--outfolder_path", help="Output folder path")

    args = parser.parse_args()
    
    logFile=f'{args.outfolder_path}/mofa_anova_analysis.log'
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(stream=sys.stdout),
            #logging.FileHandler(logFile)
        ]
    )
    
    logging.info('Start main')
    main(args)
    logging.info('End main')