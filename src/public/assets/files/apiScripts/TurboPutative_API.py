#!/usr/bin/python
#

#
# Import modules
#
import sys
import os
import argparse
import requests
import time
import json

#
# Set constants
#
HOST = "http://localhost:8080"
#HOST = "http://turboputative.herokuapp.com"
RES_PATH = os.getcwd()

#
# Function definitions
#
def sendWorkflow(args):
    """
    Description: Send TurboPutative workflow
    Input:
        - args object containing mstable, tmtable, param and module
    Output:
        - job_id: Identifier of the workflow (server response) 
    """

    # Set api
    api = "/api/execute"
    api += f"/{args.module}" if (args.module) else ""

    # Open files
    try:
        msFileBinary = open(args.msfile, 'rb')
        tmFileBinary = open(args.tmfile, 'rb') if (args.tmfile) else None
        paramBinary = open(args.param, 'rb') if (args.param) else None
    
    except Exception as e:
        print(f'** Error when openning specified files: {str(e)}')
        print()
        sys.exit(1)

    # Define Formulary Data
    form_data = {
        "ms_table": msFileBinary,
        "tm_table": tmFileBinary,
        "parameters": paramBinary
    }

    # Send request
    response = requests.post(HOST+api, files=form_data)

    # handle error
    if not response.ok:
        print(f"** Status code: {response.status_code}")
        print(response.content)
        sys.exit(1)
    
    # Get job id
    job_id = response.json()['job_id']
    return job_id


def waitUntilFinish(job_id):
    """
    Description: Function executed when workflow is executed synchronously.
    Input:
        - job_id: String containing job identifier
    Output:
        - None
    """
    
    resObj = getStatus(job_id)

    while resObj["status"] in ['WAITING', 'RUNNING']:
        time.sleep(10)
        resObj = getStatus(job_id)
        print(f'** Status: {resObj["status"]}')
    
    if resObj["status"] == 'UNKNOWN':
        print('** Error: Requested job is UNKNOWN')

    if resObj["status"] == 'FAILED':
        print('** There was an error in workflow execution')
        print(resObj['errorInfo'])

    if resObj["status"] == 'READY':
        getResults(job_id)
    
    return 



def getStatus(job_id):
    """
    Description: Get status of requested job.
    Input:
        - job_id: String containing job identifier
    Output:
        - resObject: Dictionary
            - status: String indicating job status (WAITING, RUNNING, READY, FAILED OR UNKNOWN)
            - errorInfo: Dictionary with error information if FAILED
    """
    
    api = f"/api/execute/status/{job_id}"
    response = requests.get(HOST+api)
    resObject = response.json()
    
    return resObject


def getResults(job_id):
    """
    Description: Download job results from its id
    Input:
        - job_id: String containing the job id
    Output:
        - None --> Results are downloaded
    """
    
    api = f"/results/{job_id}"
    resultsPath = os.path.join(RES_PATH, 'TurboPutative_results.zip')

    try:
        response = requests.get(HOST+api, stream=True)

        with open(resultsPath, 'wb') as fd:
            for chunk in response.iter_content(chunk_size=128):
                fd.write(chunk)

        print(f'** Results were downloaded and saved in {resultsPath}')

    except Exception as e:
        print(f'** Error occurred when downloading job results: {str(e)}')
        sys.exit(1)
    
    return


def getCompounds(args):
    """
    Description: Read name of the compounds given by the user through argument or file
    """

    compounds = []

    # Get compounds from argument
    if args.compounds:
        _ = [compounds.append(i) for i in args.compounds]
    

    # Get compounds from file
    if args.file:

        try:
            with open(args.file, 'r') as f:
                for line in f:
                    compounds.append(line.strip())
        
        except Exception as e:
            print(f'** Error when reading file with compound names: {str(e)}')
            sys.exit(1)
    

    return compounds


def parseCompounds(compounds):
    """
    Description: Use parse API utility.
    Input:
        - compounds: List of strings with the name of the compounds
    Output:
        - jsonRes: Dictionary containing result of the processing
    """

    api = "/api/parse"
    query = '?' + '&'.join([f'compound={i}' for i in compounds])
    
    response = requests.get(HOST+api+query)

    if not response.ok:
        print(f"** Status code: {response.status_code}")
        print(response.content)
        sys.exit(1)
    
    jsonRes = response.json()
    print('** Results:')
    print(jsonRes)
    print()

    return jsonRes


def classifyCompounds(compounds):
    """
    Description: Use classify API utility.
    Input:
        - compounds: List of strings with the name of the compounds
    Output:
        - jsonRes: Dictionary containing result of the processing
    """

    api = "/api/classify"
    query = '?' + '&'.join([f'compound={i}' for i in compounds])
    
    response = requests.get(HOST+api+query)

    if not response.ok:
        print(f"** Status code: {response.status_code}")
        print(response.content)
        sys.exit(1)
    
    jsonRes = response.json()
    print('** Results:')
    print(jsonRes)
    print()

    return jsonRes


def writeJsonRes(jsonRes, filename):
    """
    Description: Write JSON results
    Infile:
        - jsonRes: Dictionary containing output information
        - filename: Name of the JSON file
    Output:
        - None
    """

    outPath = os.path.join(RES_PATH, filename)

    with open (outPath, 'w') as f:
        json.dump(jsonRes, f)

    print(f'** Results were saved in {outPath}')

    return


#
# Main
#

def main(args):
    """
    main
    """
    
    # Execute workflow
    if args.workflow:
        print()
        print('** Request workflow execution')
        print()

        # Send workflow to server and get job_id
        job_id = sendWorkflow(args)
        print(f'** Job ID: {job_id}')

        # If workflow is executed synchronously, wait until finish
        if args.sync:
            waitUntilFinish(job_id)

        
    # Ask for Job status
    if args.status:
        print()
        print('** Request job status')
        print()

        resObject = getStatus(args.status)
        print(f'** Status ({args.status}):')
        print(resObject)
    
    
    # Download results
    if args.download:
        print()
        print('** Request job results')
        print()

        # Check if status is READY
        resObject = getStatus(args.download)

        if resObject['status'] == 'READY':
            getResults(args.download)

        else:
            print(f'** Cannot download: Job status is {resObject["status"]}')
    

    # Parse compounds
    if args.parse:
        print()
        print('** Request compounds parsing')
        print()

        compounds = getCompounds(args)
        parsedRes = parseCompounds(compounds)
        writeJsonRes(parsedRes, "parsedCompounds.json")


    # Classify compounds
    if args.classify:
        print()
        print('** Request compounds classification')
        print()

        compounds = getCompounds(args)
        classifiedRes = classifyCompounds(compounds)
        writeJsonRes(classifiedRes, "classifiedCompounds.json")


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description=""" 
TurboPutative REST api - Access TurboPutative functions using api utilities

Examples:

Run workflow
    python TurboPutative_API.py --workflow --msfile MS_experiment.tsv --tmfile TM_Table.tsv --param parameters.json

Check job status
    python TurboPutative_API.py --status 123456
    
Download job
    python TurboPutative_API.py --download 123456

Parse name of compounds
    python TurboPutative_API.py --parse --compounds "(2E)-2-decenal"
    
Classify compounds
    python TurboPutative_API.py --classify --compounds "histidine"
    """, formatter_class=argparse.RawTextHelpFormatter)

    # WORKFLOW EXECUTION
    parser.add_argument('--workflow', action="store_true", \
        help="""Execute customized TurboPutative workflow 

If --workflow is selected, the following arguments can be used:
    --msfile FILE   File containing the MS table with metabolite information (required)
    --tmfile FILE   File containing the table with additional information used by TableMerger
    --param FILE    JSON file containing the parameters used in workflow execution

If only one module is going to be executed, it can be specified using --module:
    --module {Tagger, REname, RowMerger or TableMerger}

To check job status use the following argument:
    --status JOB_ID

If the job is READY, the results can be downloaded using the following argument:
    --download JOB_ID

The script can be run synchronously using --sync argument.
    
""")

    parser.add_argument('--msfile', type=str, metavar="FILE", help=argparse.SUPPRESS)
    
    parser.add_argument('--tmfile', type=str, metavar="FILE", help=argparse.SUPPRESS)

    parser.add_argument('--module', help=argparse.SUPPRESS)
    
    parser.add_argument('--param', type=str, metavar="FILE", help=argparse.SUPPRESS)

    parser.add_argument('--sync', action='store_true', help=argparse.SUPPRESS)
    
    parser.add_argument('--status', metavar='JOB_ID', type=str, help=argparse.SUPPRESS)

    parser.add_argument('--download', metavar='JOB_ID', type=str, help=argparse.SUPPRESS)

    # Parser compounds
    parser.add_argument('--parse', action="store_true",\
        help="""Process the name of the metabolites to remove the information related 
with the isomerism. For example, (2E)-2-decenal will be converted to decenal.

The compounds can be specified using the following arguments:
    --compounds NAME    Name of the compounds
    --file FILE         File containing a compound on each line

""")

    # Classify compounds
    parser.add_argument('--classify', action="store_true",\
        help="""Check if the compounds are characterized as human exogenous 
metabolites coming from food, drug, microbial, halogen, natural product or plants. 
For example, Histidine would be classified as food, drug and natural product.

The compounds can be specified using the following arguments:
    --compounds NAME    Name of the compounds
    --file FILE         File containing a compound on each line

""")

    # Required arguments for parse and compounds
    parser.add_argument('--compounds', type=str, metavar="NAME", nargs='+', help=argparse.SUPPRESS)
    parser.add_argument('--file', type=str, metavar="FILE", help=argparse.SUPPRESS)

    # Create args variable
    args = parser.parse_args()

    # Perform checkings
    if (args.workflow==False) and (args.parse==False) and (args.classify==False) and (args.status==None) and (args.download==None):
        parser.print_help()
        sys.exit(0)

    if (args.workflow == True) and (args.msfile == None):
        print('** Error: To execute workflow, --msfile must be specified. See --help for more information.')
        print()
        # parser.print_help()
        sys.exit(1)
    
    if (args.workflow == True) and args.module != None:

        if args.module.lower() not in ['tagger', 'rename', 'rowmerger', 'tablemerger']:
            print('** Module choice error: selected module must be Tagger, REname, RowMerger or TableMerger. See --help for more information.')
            print()
            sys.exit(1)


    if (args.parse == True) and ( (args.compounds == None) and (args.file == None) ):
        print('** Error: To parse the name of the compounds, metabolites must be specified using --compounds or --file. See --help for more information.')
        print()
        # parser.print_help()
        sys.exit(1)

    if args.classify and ( (args.compounds == None) and (args.file == None) ):
        print('** Error: To classify metabolites, the name of the compounds must be specified using --compounds or --file. See --help for more information.')
        print()
        # parser.print_help()
        sys.exit(1)

    # Execute main
    main(args)