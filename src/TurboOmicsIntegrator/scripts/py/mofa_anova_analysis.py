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
def perform_mofa_and_save(xq, xm, myID, outfolder_path):
    
    data_mat = [xq.to_numpy(), xm.to_numpy()]

    ent = entry_point()

    ent.set_data_options(
        scale_groups=False,
        scale_views=False,
        center_groups=False
    )

    ent.set_data_matrix(
        data=data_mat,
        views_names=['q', 'm'],
        features_names=[xq.columns, xm.columns],
        samples_names=[myID],
        likelihoods=['gaussian', 'gaussian']
    )

    ent.set_model_options(
        factors=min(len(myID), xq.shape[1]+xm.shape[1]),
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
        seed=1
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
        'q': loadings.loc[xq.columns].to_dict(),
        'm': loadings.loc[xm.columns].to_dict()
    }

    # explained variance
    explained_variance = dict(list(
        model.get_variance_explained().set_index('Factor')\
            .rename(columns={'R2': 'Explained_Variance'}).groupby('View')
    ))
    explained_variance = {
        'q': explained_variance['q'].drop(['View', 'Group'], axis=1).T.to_dict(),
        'm': explained_variance['m'].drop(['View', 'Group'], axis=1).T.to_dict()
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
    
    xq = read_dataframe(args.xq_path)
    logging.info(f'Xq file read: {args.xq_path} read')

    xm = read_dataframe(args.xm_path)
    logging.info(f'Xm file read: {args.xm_path} read')
    
    mdata = read_dataframe(args.mdata_path)
    logging.info(f'mdataType file read: {args.mdata_path}')
    

    #
    # Set indexes
    #
    xq.index = myIndex['xq']
    xm.index = myIndex['xm']
    mdata.index = myIndex['mdata']

    #
    # Get only common observations
    #
    myID = np.intersect1d(xq.index, xm.index)
    xq = xq.loc[myID]
    xm = xm.loc[myID]
    mdata = mdata.loc[myID]
    
    
    #
    # Calculate PCA
    #
    logging.info('Applying MOFA...')
    projections_df, loadings_df, explained_variance_df = perform_mofa_and_save(
        xq,
        xm,
        myID,
        args.outfolder_path
        )
    logging.info("MOFA completed")
    
    logging.info('Calculating ANOVA and Tukey-HSD...')
    anova_res = get_anova_tukey(projections_df, mdata, mdataType, outfolder_path)
    with open(os.path.join(outfolder_path, 'anova.json'), 'w') as f:
        json.dump(anova_res, f)
    logging.info("ANOVA and Tukey-HSD completed")
    
    return 0


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="""
    MOFA, ANOVA and Tukey-HSD analysis. 
        Exec example: 
            python mofa_anova_analysis.py
    """)
    
    parser.add_argument("--xq_path", help="Path to proteomic quantifications")
    parser.add_argument("--xm_path", help="Path to metabolomic quantifications")
    parser.add_argument("--mdata_path", help="Path to metadata")
    parser.add_argument("--mdata_type_path", help="Path to metadata type")
    parser.add_argument("--index_path", help="Path to table indexes")
    parser.add_argument("--outfolder_path", help="Output folder path")

    args = parser.parse_args()
    
    logFile=f'{args.outfolder_path}/mofa_anova_analysis.log'
    print(logFile)
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