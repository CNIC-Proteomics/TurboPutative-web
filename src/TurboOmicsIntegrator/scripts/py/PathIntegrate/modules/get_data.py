import logging
import json
import pandas as pd
import sspa

def get_data(args):
    # Read index.json
    logging.info('Reading index.json')
    with open(args['index'], 'r') as f:
        myindex = json.load(f)

    # Read metadata & extract dependent variable
    logging.info('Reading mdata and extracting dependent variable')
    mdata = pd.read_json(args['mdata'])
    mdata.index = myindex['mdata']

    depVarSerie = mdata[args['col']]

    if args['type'] == 'categorical':
        workingSamples, depVarList = list(zip(*[
         (key, 1) if value == args['val1'] else (key, 0)
         for key, value in zip(depVarSerie.index, depVarSerie.values) 
         if value in [args['val1'], args['val2']]
         ]))

    if args['type'] == 'numeric':
        workingSamples = depVarSerie.index[~depVarSerie.isna()].tolist()
        depVarList = depVarSerie[workingSamples].values.tolist()
        

    # Read f2id.json
    logging.info('Reading f2id.json')
    f2id = {}
    for key, value in args['f2id'].items():
        with open(value, 'r') as f:
            f2id[key] = json.load(f)

    f2o = {}
    for key, value in f2id.items():
        for i in value.values():
            f2o[i] = key


    # Read Xi
    logging.info('Reading Xi files')
    xi = {}
    for key, value in args['xi'].items():
        logging.info(f'Reading X{key}')
        with open(value, 'r') as f:
            xi[key] = pd.DataFrame(json.load(f), index=myindex['x'+key])
            xi[key] = xi[key].loc[workingSamples, :]
            xi[key].columns = [f2id[key][i] for i in xi[key].columns]
            
    # Read Reactome database
    logging.info('Reading Reactome gmt file')
    mo_paths = sspa.process_gmt(infile=args['gmt'])
    mo_paths = mo_paths.astype('object')
    
    return workingSamples, depVarList, xi, mo_paths, f2o