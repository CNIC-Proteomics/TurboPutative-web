import argparse
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.impute import KNNImputer, SimpleImputer
from sklearn.ensemble import RandomForestRegressor
import logging
import os
import sys

#
# Local Functions
#

def scale_data(df):
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df)
    return pd.DataFrame(scaled_data, columns=df.columns)

def impute_data(df, impute_method):
    if impute_method == "KNN":
        imputer = KNNImputer()
    elif impute_method == "Mean":
        imputer = SimpleImputer(strategy='mean')
    elif impute_method == "Median":
        imputer = SimpleImputer(strategy='median')
    # elif impute_method == "Min":
    #     imputer = SimpleImputer(strategy='most_frequent')
    elif impute_method == "RF":
        imputer = RandomForestRegressor()

    imputed_data = imputer.fit_transform(df)
    return pd.DataFrame(imputed_data, columns=df.columns)

#
# Main
#

def main(args):

    try:
        df = pd.read_json(args.input_file)
        logging.info(f"Loaded data from {args.input_file}")

        df = df.loc[:, df.isna().sum().div(df.shape[0]) <= args.mvthr]
        logging.info(f"Filtered using missing value threshold: {args.mvthr}")

        df_scaled = scale_data(df)
        logging.info("Scaled data by columns")

        df_imputed = impute_data(df_scaled, args.impute_method)
        logging.info(f"Imputed missing values using {args.impute_method} method")

        output_file = args.input_file.replace(".json", "_norm.json")
        df_imputed.to_json(output_file, orient='records')
        logging.info(f"Saved preprocessed data to {output_file}")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="""
        Data preprocessing tool. 
        Exec example: 
            python data_scaler_and_imputer.py input.json RandomForest
    """)
    parser.add_argument("input_file", help="Path to the input JSON file")
    parser.add_argument("impute_method", help="Imputation method: KNN, Mean, Median, Min, RandomForest")
    parser.add_argument("mvthr", help="Features with higher fraction of missing values will be removed", type=float)
    args = parser.parse_args()

    logFile=f'{os.path.dirname(args.input_file)}/preprocessing.log'
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