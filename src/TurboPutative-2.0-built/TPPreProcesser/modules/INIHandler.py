#!/usr/bin/env python

# -*- coding: utf-8 -*-

# Import modules
import os
import logging
import re
from configparser import ConfigParser

import modules.TPExceptions as TPExc
import modules.constants as constants


class ModuleInfo:
    """
    Write ini file containing information used by different C++ modules (and Python classes)
    """
    def __init__(self, workflow, workdir):
        
        # Attributes
        self.config = ConfigParser()
        self.iniDict = {}
        self.workdir = workdir
        self.workflow = workflow
    

    def addModules(self):
        """
        Add information of each module
        """

        inFile = constants.OUTNAME
        cores = min(max(int(os.cpu_count()*constants.CORES_RATIO), 1), os.cpu_count()) # Get number of cores between 1 and maxCores

        i = 0
        for module in self.workflow:

            if module == "1":
                i += 1
                outFile = f"{i}_Tagger.tsv"

                self.iniDict['Tagger'] = {
                    'infile': inFile,
                    'outfile': outFile,
                    'n': i,
                    'cores': cores
                }

            elif module == "2":
                i += 1
                outFile = f"{i}_REname.tsv"

                self.iniDict['REname'] = {
                    'infile': inFile,
                    'outfile': outFile,
                    'n': i,
                    'cores': cores
                }

            elif module == "3":
                i += 1
                outFile = f"{i}_RowMerger.tsv"

                self.iniDict['RowMerger'] = {
                    'infile': inFile,
                    'outfile': outFile,
                    'n': i
                }

            elif module == "4":
                i += 1
                outFile = f"{i}_TableMerger.tsv"

                self.iniDict['TableMerger'] = {
                    'infile': inFile,
                    'outfile': outFile,
                    'n': i,
                    "tmfile": constants.OUTNAME_TMTABLE
                }
            
            elif module == "5":
                outFile = f"{i}_TPMetrics.tsv" # change i+1 --> i (TableMerger and TPMetrics are one module in the front-end)

                self.iniDict['TPMetrics'] = {
                    'infile': inFile,
                    'outfile': outFile
                }
            
            elif module == "6":
                outFile = f"{i}_TPFilter.tsv" # change i+1 --> i (TableMerger and TPFilter are one module in the front-end)

                self.iniDict['TPFilter'] = {
                    #'infile': inFile, # infile of TPFilter is in TPMetrics object
                    'outfile': outFile
                }
            
            inFile = outFile
        

    def addColumnNamesMSTable(self, msColumns):
        """
        Add to config file de name of the MSTable columns that will be processed in each module
        """

        for module in self.workflow:

            if module == '1': # Tagger
                self.iniDict["Tagger"]["column_name"] = self.getColumnNameFromType(msColumns, "name")
                self.iniDict["Tagger"]["column_chemical_formula"] = self.getColumnNameFromType(msColumns, "chemical_formula")

            if module == '2': # REname
                self.iniDict["REname"]["column_name"] = self.getColumnNameFromType(msColumns, "name")
                self.iniDict["REname"]["column_mass"] = self.getColumnNameFromType(msColumns, "mass")
                self.iniDict["REname"]["column_inchi_key"] = self.getColumnNameFromType(msColumns, "inchi_key")

            if module == '3': # RowMerger
                self.iniDict["RowMerger"]["column_name"] = self.getColumnNameFromType(msColumns, "name")
                self.iniDict["RowMerger"]["column_mass"] = self.getColumnNameFromType(msColumns, "mass")

            if module == '4': # TableMerger
                self.iniDict["TableMerger"]["ms_column_name"] = self.getColumnNameFromType(msColumns, "name")
                self.iniDict["TableMerger"]["ms_column_mass"] = self.getColumnNameFromType(msColumns, "mass")
                self.iniDict["TableMerger"]["ms_column_rt"] = self.getColumnNameFromType(msColumns, "rt")
            
            #if module == '5': # TPMetrics
                # TPMetrics column information is added in addTPMetricsColumns method 


    def addTPMetricsColumns(self, candidateColumns):
        '''
        Add name of the columns used by TPMetrics module
        ''' 
        self.iniDict["TPMetrics"]["column_mass"] = self.getColumnNameFromType(candidateColumns, "mass")
        self.iniDict["TPMetrics"]["column_name"] = self.getColumnNameFromType(candidateColumns, "name")
        self.iniDict["TPMetrics"]["column_rt"] = self.getColumnNameFromType(candidateColumns, "rt")
        self.iniDict["TPMetrics"]["column_adduct"] = self.getColumnNameFromType(candidateColumns, "adduct")
        self.iniDict["TPMetrics"]["column_molweight"] = self.getColumnNameFromType(candidateColumns, "molecular_weight")
        self.iniDict["TPMetrics"]["column_error"] = self.getColumnNameFromType(candidateColumns, "mzError")

        # get column containing intensities
        ipatt = re.compile(self.iniDict["TPMetrics"]['i_pattern'])
        icolumns  = [
            i for i in candidateColumns if ipatt.search(i)
        ]

        self.iniDict["TPMetrics"]["column_intensities"] = ' // '.join(icolumns) if len(icolumns)>0 else 'None'

        # Check presence of all columns
        missing_columns = [i for i,j in self.iniDict["TPMetrics"].items() if j=='None']
        if len(missing_columns)>0:
            raise TPExc.TPMetricsColumnError(self.workdir, missing_columns)


    def addColumnNamesTMTable(self, tmColumns):
        """
        Add to config file the name of the TMTable columns that will be processed
        """
        self.iniDict["TableMerger"]["tm_column_mass"] = self.getColumnNameFromType(tmColumns, "mass")
        self.iniDict["TableMerger"]["tm_column_rt"] = self.getColumnNameFromType(tmColumns, "rt")

    
    def getColumnNameFromType(self, columns, type):
        """
        From list with name of the columns, get the one corresponding to the type
        """
        
        possibleNames = [i.lower().strip() for i in constants.COLUMN_NAMES[type]]
        targetCol = [i for i in columns if i.lower().strip() in possibleNames]

        if len(targetCol) > 0:
            return targetCol[0]
        else:
            return "None"


    def writeINI(self, workDir):
        """
        Write information in INI file
        """

        self.config.read_dict(self.iniDict)

        fullPath = os.path.join(workDir, constants.INFO_FILENAME)
        with open(fullPath, 'w') as f:
            self.config.write(f)
        
        logging.info(f"Config file written successfully: {fullPath}")

# Define class
class InputINI:
    """
    Class to open and handle input ini file with user information
    """

    def __init__(self, args):
        
        self.fullPath = os.path.join(args.workdir, constants.INPUT_INI_FILENAME)
        self.config = self.readINI()

        # Attributes used of exception raised
        self.workdir = args.workdir
        self.fullName = args.infile
    
    def readINI(self):
        """
        Read ini file with input user information
        """
        config = ConfigParser()
        config.read(self.fullPath)
        return config
    
    def transferToModuleInfo(self, moduleInfo, columnsList):
        """
        Transfer parameters from user ini to ini used by C++ modules (ModuleInfo)
        """

        # Loop over modules in C++ ini
        for module in moduleInfo.iniDict:

            if module == "Tagger":
                # transfer tags...
                for tag in constants.TAGS:
                    moduleInfo.iniDict[module][tag] = self.config[module][tag]

                # transfer other information of interest (REGEX)
                userHalogenatedRegex = self.config[module]["halogenated_regex"]
                halogenatedRegex = userHalogenatedRegex if len(userHalogenatedRegex)!=0 else constants.DEFAULT_HALOGENATED_REGEX
                moduleInfo.iniDict[module]["halogenated_regex"] = halogenatedRegex

                userPeptideRegex = self.config[module]["peptide_regex"]
                peptideRegex = userPeptideRegex if len(userPeptideRegex)!=0 else constants.DEFAULT_PEPTIDE_REGEX
                moduleInfo.iniDict[module]["peptide_regex"] = peptideRegex
            
            if module == "REname":
                
                user_aa_separator = self.config[module]["aminoacid_separator"]
                aa_separator = user_aa_separator if len(user_aa_separator) != 0 else constants.DEFAULT_AA_SEPARATOR
                moduleInfo.iniDict[module]["aminoacid_separator"] = aa_separator

                user_remove_row_regex = self.config[module]["remove_row"]
                remove_row_regex = user_remove_row_regex if len(user_remove_row_regex) != 0 else constants.DEFAULT_REMOVE_ROW_REGEX
                moduleInfo.iniDict[module]["remove_row"] = remove_row_regex

            
            if module == "RowMerger":
                # check compared and conserved columns
                comparedList, conservedList, nameCompare = self.checkComparedConserved(self.config[module]["compared_columns"], self.config[module]["conserved_columns"], columnsList, moduleInfo)
                moduleInfo.iniDict[module]["compared_columns"] = ','.join(comparedList)
                moduleInfo.iniDict[module]["conserved_columns"] = ','.join(conservedList)
                moduleInfo.iniDict[module]["compared_name"] = nameCompare
            
            if module == "TableMerger":

                user_n_digits = self.config[module]["n_digits"]
                n_digits = user_n_digits if re.match('^[0-9]+$', user_n_digits) else constants.DEFAULT_N_DIGITS
                moduleInfo.iniDict[module]["n_digits"] = n_digits

            if module == "TPMetrics":
                moduleInfo.iniDict[module]["rt1"] = self.config[module]["rt1"]
                moduleInfo.iniDict[module]["rt2"] = self.config[module]["rt2"]
                moduleInfo.iniDict[module]["i_pattern"] = self.config[module]["i_pattern"]
                moduleInfo.iniDict[module]["class_adducts"] = self.config[module]["class_adducts"]
                moduleInfo.iniDict[module]["corr_type"] = self.config[module]["corr_type"]
        
        return moduleInfo

    
    def checkComparedConserved(self, compared, conserved, columnsList, moduleInfo):
        """
        Check compared and conserved columns in RowMerger
        """

        comparedList = [i.strip() for i in compared.split(",")]
        conservedList = [i.strip() for i in conserved.split(",")]

        # if nothing is added to compare, add by default (default in JavaScript will overwrite this default...)
        if len(comparedList)==1 and comparedList[0]=='':
            comparedList = [
                [i for i in columnsList if i.lower() in constants.COLUMN_NAMES["mass"]],
                [i for i in columnsList if i.lower() in constants.COLUMN_NAMES["adduct"]],
                [i for i in columnsList if i.lower() in constants.COLUMN_NAMES["mzError"]]
            ]

            # comparedList will not be empty (in TableTester we check that mass is present if RowMerger is selected)
            comparedList = [i[0] for i in comparedList if len(i)>0]

        # if conserved is empty, add all columns (excluding compared)
        if len(conservedList)==1 and conservedList[0]=='':
            conservedList = [i for i in columnsList if i not in comparedList]


        # check that all columns are in the table
        missingComparedCol = [i for i in comparedList if i not in columnsList]
        if len(missingComparedCol)>0: #any([i not in columnsList for i in comparedList]):
            TPExc.TPRowMergerComparedColumn(missingComparedCol, columnsList, self.fullName, self.workdir)
        
        missingConservedCol = [i for i in conservedList if i not in columnsList]
        if len(missingConservedCol)>0: #any([i not in columnsList for i in conservedList]):
            TPExc.TPRowMergerConservedColumn(missingConservedCol, columnsList, self.fullName, self.workdir)
        
        # add to compare tag columns
        if "Tagger" in moduleInfo.iniDict.keys():
            _ = [comparedList.append(constants.TAGS_DICT[i]) for i in constants.TAGS_DICT if moduleInfo.iniDict["Tagger"][i]=="true"]
            # _ = [comparedList.append(i) for i in constants.COLUMN_NAMES["tags"] if i in columnsList]

        # if name is in compare, save it in a parameter
        preNameCompare = [i for i in comparedList if i.lower() in constants.COLUMN_NAMES["name"]]
        nameCompare = "" if len(preNameCompare)==0 else preNameCompare[0]

        # remove name from compared (if present)
        comparedList = [i for i in comparedList if i.lower() not in constants.COLUMN_NAMES["name"]]

        # return compare, conserve and name
        return [comparedList, conservedList, nameCompare]