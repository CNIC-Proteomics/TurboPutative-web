//
// Object containing information related with RUNNING and WAITING processes
//
const path = require ('path');
const runJob = require (path.join(__dirname, '../routes/lib/runJob.js'));

/*
jobObject:
{
    jobID: string,
    modules: string
    msTableName: string,
    tmTableName: string
}
*/

var processManager = {

    MAX_PROCESS: 2,

    n_running: 0, // number of process that are being run

    running: [], // array with objects that are running
    waiting: [], // array with objects that are waiting

    addProcess: function (jobObject) {
        // Add job to waiting list
        console.log (`** Adding new process to WAITING: ${jobObject.jobID}`);
        this.waiting.push(jobObject);
        this.launch();
        return;
    },

    completed: function (jobID_completed) {
        // Remove from running the process that is completed (using jobID)
        for (let i=0; i<this.running.length; i++)
        {
            if (this.running[i].jobID == jobID_completed) 
            {
                console.log (`** RUNNING process finished: ${jobID_completed}`);
                this.running.splice(i, 1); 
                this.n_running--;
                this.launch();
                return;
            }
        }
    },

    launch: function () {
        // Run waiting process (if any)
        if (this.waiting.length == 0) return; // there is not waiting process
        if (this.n_running == this.MAX_PROCESS) return; // maximum number of processes are being run
        
        console.log (`** Move process from WAITING to RUNNING: ${this.waiting[0].jobID}`);
        console.log(this);

        // run waiting process
        runJob(this.waiting[0]);
        this.waiting.splice(0,1);
        this.n_running++;
        return;
    },

    status: function (jobID_status) {
        // Get status (RUNNING/WAITING) of a job

        console.log('** Process Manager:');
        console.log(this);
        
        let status = 'UNKNOWN';

        // check if running
        this.running.forEach(element => {
            if (jobID_status == element.jobID) status = 'RUNNING';
        });

        // check if waiting
        this.waiting.forEach(element => {
            if (jobID_status == element.jobID) status = 'WAITING';
        });

        return status;
    }   

}

// Export object
module.exports = processManager;