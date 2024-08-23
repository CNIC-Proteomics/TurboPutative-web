import argparse
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import KNNImputer, SimpleImputer, IterativeImputer
from sklearn.ensemble import RandomForestRegressor
import logging
import os
import sys
import subprocess

#
# Local Functions
#

class MyImputer():
    def __init__(self, strategy='minimum'):
        self.strategy = strategy
    
    def fit_transform(self, X):
        if self.strategy=='minimum':
            return X.fillna(X.min().min())

def scale_data(df):
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df)
    return pd.DataFrame(scaled_data, columns=df.columns)

def impute_data(df, impute_method):
    if impute_method == "KNN":
        imputer = KNNImputer(n_neighbors = 3)
    elif impute_method == "Mean":
        imputer = SimpleImputer(strategy='mean')
    elif impute_method == "Median":
        imputer = SimpleImputer(strategy='median')
    elif impute_method == "Minimum":
        imputer = MyImputer(strategy='minimum')
    elif impute_method == "RF":
        imputer = IterativeImputer(estimator=RandomForestRegressor())

    imputed_data = imputer.fit_transform(df)
    return pd.DataFrame(imputed_data, columns=df.columns)

#
# Main
#

def main(args):
    try:
        logging.info(f"Reading input file from {args.infile}")
        df = pd.read_json(args.infile)
        
        logging.info(f"Filtering using missing value threshold: {args.impute_mvthr}")
        df = df.loc[:, df.isna().sum().div(df.shape[0]) <= args.impute_mvthr]

        if args.norm != 'None':

            if args.norm in ['log2', 'log2+median']:
                logging.info("Applying Log2 transformation to data")
                if (df <= 0).sum().sum() == 0:
                    df = np.log2(df)
                else:
                    logging.error('Log2 could not be calculated due to the presence of invalid values')
                
            if args.norm == 'log2+median':
                logging.info("Substract median to each sample")
                df = pd.DataFrame(
                    RobustScaler(
                        with_centering=True, 
                        with_scaling=False, 
                        quantile_range=(0,1)
                    ).fit_transform(df.T).T,
                    index=df.index, columns=df.columns
                )
            
            if args.norm == 'vsn':
                logging.info("Apply VSN method")

                vsnPath = os.path.dirname(args.infile) + '/vsn'
                vsnInfile = os.path.splitext(os.path.basename(args.infile))[0]+'_pre_vsn.tsv'
                vsnOutfile = os.path.splitext(os.path.basename(args.infile))[0]+'_post_vsn.tsv'
                vsnOutpng = os.path.splitext(os.path.basename(args.infile))[0]+'_vsn.png'
                
                _df = df.copy()
                _df.columns = [f'F{i}' for i in range(df.shape[1])]
                _df.index = [f'S{i}' for i in range(df.shape[0])]
                _df.T.to_csv(os.path.join(vsnPath, vsnInfile), sep='\t')
                
                process = subprocess.run([
                    args.RPath,
                    args.myVSNR,
                    os.path.join(vsnPath, vsnInfile), 
                    os.path.join(vsnPath, vsnOutfile),
                    os.path.join(vsnPath, vsnOutpng),
                ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                logging.info("myVSN.R output:")
                logging.info(process.stdout.decode('utf-8'))

                _df = pd.read_csv(
                    os.path.join(vsnPath, vsnOutfile), sep='\t'
                ).T

                _df.index = df.index
                _df.columns = df.columns
                df = _df

        if args.scale:
            logging.info("Centering and scaling data by columns")
            df = scale_data(df)

        if df.isna().sum().sum()>0:    
            logging.info(f"Imputing missing values using {args.impute_method} method")
            df = impute_data(df, args.impute_method)

        output_file = args.infile.replace(".json", "_norm.json")
        df.to_json(output_file, orient='records')
        logging.info(f"Saved preprocessed data to {output_file}")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="""
        Data preprocessing tool. 
        Exec example: 
            python data_scaler_and_imputer.py input.json RandomForest
    """)
    parser.add_argument("--infile", help="Path to the input JSON file")

    parser.add_argument("--norm", help="None / log2 / vsn", default="none", type=str)
    
    parser.add_argument("--scale", help="", default=False, action='store_true')
    parser.add_argument("--no-scale", help="", dest='scale', action='store_false')

    parser.add_argument("--impute-method", help="", type=str)
    parser.add_argument("--impute-mvthr", help="", type=float)

    parser.add_argument("--RPath", help="", type=str)
    parser.add_argument("--myVSNR", help="", type=str)

    args = parser.parse_args()

    logFile=f'{os.path.dirname(args.infile)}/preprocessing.log'
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