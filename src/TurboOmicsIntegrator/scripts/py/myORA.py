import argparse
import numpy as np
import logging
import os
import sys
import json
from scipy.stats import hypergeom
import pandas as pd


#
# Main
#


def main(_args):
    #
    # Read gmt
    #
    args = vars(_args)
    
    logging.info("Reading GMT file")
    f = open(args['gmt'], 'r')
    gmt = [i.strip().split('\t') for i in f]
    f.close()
    
    # remove if not containing compounds
    gmt = [i for i in gmt if len(i)>2]
    
    # Generate list of dict with categories
    gmt = [{
      "id": i[0],
      "name": i[1],
      "cid": i[2:]
      }
     for i in gmt]
    
    
    #
    # Read job compound
    #
    logging.info("Reading input elements")
    f = open(args['infile'], 'r')
    myid = json.load(f)
    f.close()
    
    myBackg = set([i['id'] for i in myid])
    mySig = set([i['id'] for i in myid if i['target']])
    
    
    #
    # Get sets and numbers for hypergeometric test
    #
    logging.info('Applying hypergeometric test')
    _ = [i.update({
        'pathway_mapped': list(myBackg.intersection(set(i['cid']))),
        'pathway_sig': list(mySig.intersection(set(i['cid'])))
        }) for i in gmt]
    
    _ = [i.update({
        'N_pathway_mapped': len(i['pathway_mapped']),
        'N_pathway_sig': len(i['pathway_sig'])
        }) for i in gmt]
    
    #
    # Filter categories with N_pahway_sig > 0
    #
    gmt = [i for i in gmt if i['N_pathway_sig']>0]
    
    #
    # Calculate hypergeom pvalue
    #
    _ = [
     i.update({
         'pvalue': 1-hypergeom.cdf(
             k=i['N_pathway_sig']-1,
             M=len(myBackg),
             n=i['N_pathway_mapped'],
             N=len(mySig)
             )
         })
     for i in gmt]
    
    
    gmt = pd.DataFrame(gmt).sort_values('pvalue').to_dict(orient='records')
    
    _ = [i.update({'FDR': len(gmt)*i['pvalue']/(n+1)}) for n, i in enumerate(gmt)]
    
    #
    # Write output file
    #
    logging.info("Writing ORA results")
    f = open(args['outfile'], 'w')
    json.dump(gmt, f)
    f.close()
    
    return 0



if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="""
        Data Overrepresentation analysis. 
        Exec example: 
            python data_scaler_and_imputer.py input.json RandomForest
    """)
    parser.add_argument("--infile", help="Path to the input JSON file with background and target compounds")
    parser.add_argument("--outfile", help="Path to the output JSON file with ORA results")
    parser.add_argument("--gmt", help="Path to the gmt file with categories")
    

    args = parser.parse_args()

    logFile=f'{os.path.dirname(args.infile)}/myORA.log'
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
    logging.info('End')