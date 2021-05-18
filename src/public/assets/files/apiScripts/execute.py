# Import modules
import sys
import requests
import time

# Set constants
PATH_TO_PARAMETERS_JSON = "/home/rafael/CNIC/Metabolomica/heroku-web/turboputative/src/public/assets/files/defaultParameters/parameters.json"
PATH_TO_MS_TABLE = "/home/rafael/CNIC/Metabolomica/heroku-web/turboputative/src/public/assets/files/MS_experiment.xls"
PATH_TO_TM_TABLE = "/home/rafael/CNIC/Metabolomica/heroku-web/turboputative/src/public/assets/files/FeatureInfo.xlsx"

ASYNC = False # If False, it will ask for job status until it is finished


# Main function
def main():
    '''
    Main function
    '''

    # build form as dictionary
    form_data = {
        "parameters": open(PATH_TO_PARAMETERS_JSON, 'rb'),
        "ms_table": open(PATH_TO_MS_TABLE, 'rb'),
        "tm_table": open(PATH_TO_TM_TABLE, 'rb')
    }

    # build url
    host = "http://turboputative.herokuapp.com"
    api = "/api/execute"
    url = host + api

    # send request
    response = requests.post(url, files=form_data)

    # handle error
    if not response.ok:
        print(f"Status code: {response.status_code}")
        print(response.content)
        sys.exit(1)
    
    job_id = response.json()['job_id']

    # if async, print job_id and exit script 
    if ASYNC:
        print(response.json())
        sys.exit(0)
    
    # if not async, ask for job status until finish
    while not ASYNC:
        
        time.sleep(1)
        job_status = requests.get(host + "/api/execute/status/" + job_id).json()

        if job_status["status"] == "WAITING": 
            print("WAITING")
            continue

        elif job_status["status"] == "READY":
            print("READY")
            print("Downloading results")
            job_result = requests.get(job_status['downloadURL'], allow_redirects=True)
            open("TurboPutative_results.zip", 'wb').write(job_result.content)
            sys.exit(0)
        
        else:
            print("ERROR")
            print(job_status)
            sys.exit(1)
        

if __name__ == "__main__":

    main()