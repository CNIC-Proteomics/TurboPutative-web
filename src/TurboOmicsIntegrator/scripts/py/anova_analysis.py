import os
import json
import logging
import statsmodels.api as sm
from statsmodels.formula.api import ols
from scipy.stats import tukey_hsd


# Calculate ANOVA and Tukey
def get_anova_tukey(projections_df, mdata, mdataType, outfolder_path):

    anova_res = {}
    
    for ycol in projections_df.columns.tolist():
        anova_res[ycol] = {}
        
        for xcol in mdata.columns.tolist():    
            anova_res[ycol][xcol] = {}
            
            df_lm = projections_df[[ycol]].join(mdata[[xcol]], how='inner').dropna(axis=0).rename(columns={ycol:'Y', xcol:'X'})
            
            
            try: 
                logging.info(f'Calculating ANOVA: {ycol} - {xcol}')
                if mdataType[xcol]['type']=='categorical':                
                    lm = ols('Y ~ C(X)', df_lm).fit()
                    anova = sm.stats.anova_lm(lm, typ=2).rename(columns={'PR(>F)': 'pvalue'})
                    anova_res[ycol][xcol] = dict(anova.loc['C(X)', :])
                    
                elif mdataType[xcol]['type']=='numeric':
                    lm = ols('Y ~ X', df_lm).fit()
                    anova = sm.stats.anova_lm(lm, typ=2).rename(columns={'PR(>F)': 'pvalue'})
                    anova_res[ycol][xcol] = dict(anova.loc['X', :])            
            
            except Exception as e:
                #anova_res[(ycol, xcol)] = None
                logging.error(f'ANOVA error in {(ycol, xcol)}')
                logging.error(e)
                continue
            
            
            if mdataType[xcol]['type']=='categorical' and mdataType[xcol]['nlevels']>2:
                try:
                    logging.info(f'Calculating Tukey-HSD: {ycol} - {xcol}')
                    anova_res[ycol][xcol]['tukey_hsd'] = {}
                    
                    groups, values = list(zip(*list(df_lm.groupby('X'))))    
                    values = [i.Y.values for i in values]
                    tukey = tukey_hsd(*values)    
                
                    anova_res[ycol][xcol]['tukey_hsd']['groups'] = groups
                    anova_res[ycol][xcol]['tukey_hsd']['pvalues'] = tukey.pvalue.tolist()
                
                except Exception as e:
                    logging.error(f'Tukey-HSD error in {(ycol, xcol)}')
                    logging.error(e)
                    continue
                
    return anova_res