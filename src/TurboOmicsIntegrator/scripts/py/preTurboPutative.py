import argparse
import pandas as pd
import logging
import os
import sys
import json
import configparser
from itertools import groupby

# Main
def main(args):

    ion_mode = args.ion_mode
    tpfolder = args.tpfolder #r'/home/rbarreror/projects/TurboPutative-web/src/public/jobs/123456_pos'


    # Read index
    f = open(args.index)
    index = json.load(f)
    f.close()

    # Read cm    
    xm = pd.read_json(args.xm)
    xm.index = index['xm']
    xm = xm.T

    # Read m2i
    m2i = pd.read_json(args.m2i)
    m2i.index = index['m2i']

    # Read annParams
    f = open(args.ann)
    annParams = json.load(f)
    f.close()

    #
    # Read cmm
    #

    cmm = pd.read_json(args.cmm)

    #
    # Rename columns of cmm and write
    #

    cmm = cmm.rename(columns={
            'identifier': 'Identifier',
            'EM': 'Experimental mass',
            'adduct': 'Adduct',
            'error_ppm': 'mz Error (ppm)',
            'molecular_weight': 'Molecular Weight',
            'name': 'Name',
            'formula': 'Formula'
        })

    cmm.to_csv(
        os.path.join(tpfolder, f'CMM_{ion_mode}.tsv'),
        sep='\t', index=False
    )

    #
    # Create FeatInfo file and write
    #

    xm.columns = ['_quant_'+i for i in xm.columns]

    ionVal = annParams['ionValPos']['id'] if ion_mode == 'pos' else annParams['ionValNeg']['id']
    tmtable = m2i[
        m2i[
            annParams['ionCol']['id']
            ] == ionVal
    ]
    tmtable = tmtable.join(xm, how='inner')

    tmtable = tmtable.rename(
        columns={
            annParams['mzCol']['id']: 'Experimental mass'
            }
        )

    if annParams['rtCol'] != None:
        tmtable = tmtable.rename(
        columns={
            annParams['rtCol']['id']: 'rt'
            }
        )

    tmtable.to_csv(
        os.path.join(tpfolder, f'TM_Table_{ion_mode}.tsv'),
        sep='\t', index=False
    )

    #
    # configUser.ini
    #

    config = configparser.ConfigParser()
    config.read(os.path.join(tpfolder, 'configUser.ini'))
    config['TPMetrics']['i_pattern'] = '_quant_'

    config['TPMetrics']['rt1'] = str(annParams[f'mRtW{"Pos" if ion_mode=="pos" else "Neg"}'])
    config['TPMetrics']['rt2'] = str(annParams[f'lRtW{"Pos" if ion_mode=="pos" else "Neg"}'])

    class_adducts = annParams[f'lipidAdd{"Pos" if ion_mode=="pos" else "Neg"}']

    config['TPMetrics']['class_adducts'] = str({
        cl: list(list(zip(*list(ad)))[1])
        for cl, ad in groupby(sorted(class_adducts, key=lambda x: x[0]), key=lambda x: x[0])
        }).replace("'", '"')

    with open(os.path.join(tpfolder, 'configUser.ini'), 'w') as configfile:
        config.write(configfile)

    return 0


# Entry Point
if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="""
        Prepare folder for TurboPutative execution. 
        Exec example: 
            python preTurboPutative.py 
    """)

    parser.add_argument("--xm", help="Path to the xm_norm.json")
    parser.add_argument("--m2i", help="Path to the m2i.json")
    parser.add_argument("--ann", help="Path to the annParams.json")
    parser.add_argument("--cmm", help="Path to the CMM_ionmode.json")
    parser.add_argument("--ion_mode", help="pos/neg")
    parser.add_argument("--tpfolder", help="Path to TurboPutative folder")
    parser.add_argument("--index", help="Path to data frames index")

    args = parser.parse_args()

    #logFile=f'{os.path.dirname(args.infile)}/preprocessing.log'
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