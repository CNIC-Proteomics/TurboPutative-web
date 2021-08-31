//
// Import modules
//

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

//
// Define global object
//

updateTPMapTable = {

    // path to ppGenerator.py
    ppGeneratorPath: path.join(__dirname, "../TurboPutative-2.0-built/ppGenerator/ppGeneratorWrapper.py"),

    // path to directory containing files with compound names
    pendingFilesPath: path.join(__dirname, "../TurboPutative-2.0-built/ppGenerator/pendingFiles"),

    // Array containing name of pending files
    pendingFiles: [],

    // main method
    main: async function() {
        
        while (true)
        {
            console.log(`** Time to next REname map table update: ${this.timeToNextUpdate()/1000}s`);
            await this.runPPGenerator();
            console.log(`** REname map table updated`);
        }

    },

    // method to calculate time to next update
    timeToNextUpdate: function() {

        let myDate = new Date();

        // calculate days to next sunday
        let daysToSunday = 7 - myDate.getDay();

        // calculate milliseconds to next sunday (at this time)
        let msToSunday = daysToSunday * 24 * 3600 * 1000;

        // calculate milliseconds from 00:00
        let msToday = myDate.getHours() * 3600 * 1000 +
                      myDate.getMinutes() * 60 * 1000 +
                      myDate.getSeconds() * 1000 +
                      myDate.getMilliseconds();
        
        // calculate milliseconds to next sunday at 00:00
        let msToUpdate = msToSunday - msToday;

        return msToUpdate;
    },

    // method to run ppGenerator
    runPPGenerator: function() {

        return new Promise (resolve => {

            setTimeout(() => {

                // get name of pending files
                this.pendingFiles = fs.readdirSync(this.pendingFilesPath);

                // check if there are pending files
                if (!this.pendingFilesExtist())
                {
                    resolve("No pending file");
                    return;
                }

                // run ppGenerator
                let script = `${global.pythonPath} ${this.ppGeneratorPath} --dir ${this.pendingFilesPath}`;

                exec(script, (error, stdout, stderr) => {
                    if (error)
                    {
                        console.error(`exec error: ${error}`);
                        resolve("Execution error");
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);

                    // remove pending files
                    this.pendingFiles.forEach(element => {
                        fs.unlinkSync(path.join(this.pendingFilesPath, element));
                    });

                    resolve("Finished execution");
                    return;
                });

            }, this.timeToNextUpdate()) 

        })

    },

    // method to check if there are pending files
    pendingFilesExtist: function() {

        // check if there is any pending file
        let filesExist = this.pendingFiles.length == 0 ? false : true
        
        return filesExist;
    }

}

//
// Export modules
//

module.exports = updateTPMapTable;