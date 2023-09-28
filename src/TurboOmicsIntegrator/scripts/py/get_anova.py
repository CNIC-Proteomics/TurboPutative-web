import argparse
import os
import sys
import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
from statsmodels.stats.anova import anova_lm
import logging

import pdb


def setup_logging(log_filename):
    logging.basicConfig(filename=log_filename, level=logging.INFO,
                        format='%(asctime)s - %(levelname)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')


def main():
    parser = argparse.ArgumentParser(description="""
        Calculate ANOVA. 
        Exec example: 
            python get_anova.py input.json y_col_name
    """)
    parser.add_argument("json_path", help="Path to the input JSON file")
    parser.add_argument("y_column_name", help="Name of the column with dependent variable (Y)")
    args = parser.parse_args()

    logFile=f'{os.path.dirname(args.json_path)}/get_anova.log'
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(stream=sys.stdout),
            logging.FileHandler(logFile)
        ]
    )

    #pdb.set_trace()
    # Lee los argumentos de la línea de comandos
    json_path = args.json_path#sys.argv[1]
    y_column_name = args.y_column_name#sys.argv[2]

    try:
        # Read dataframe from json_path
        logging.info('Reading json dataframe')
        df = pd.read_json(json_path)

        # Check column existence
        if y_column_name not in df.columns:
            logging.error(f"Dependent variable {y_column_name} column was not found.")
            sys.exit(1)


        # Define additive linear model with all columns except Y
        predictors = "+".join(df.columns.difference([y_column_name]))
        model_formula = f'{y_column_name} ~ {predictors}'
        
        logging.info(f'Building model: {model_formula}')
        model = ols(model_formula, data=df).fit()

        # Type II ANOVA
        logging.info(f'Calculating type II ANOVA')
        anova_table = anova_lm(model, typ=2)

        # Imprime la tabla de resultados en la consola
        print("###")
        print(anova_table)
        print('###')

        # Registra la tabla de resultados en el archivo de registro
        logging.info("ANOVA results table:\n" + str(anova_table))

    except FileNotFoundError:
        logging.error(f"File could not be found: {json_path}")
    except Exception as e:
        logging.error(f"An error occured: {str(e)}")


if __name__ == "__main__":
    main()
