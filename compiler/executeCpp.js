const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { exec } = require('child_process');

const outputPath = path.join(__dirname, "outputs");

// Check if directory exists, if not create it
if (!fs.existsSync(outputPath)) {
    fs.mkdir(outputPath, { recursive: true }, (error) => {
        console.log("Error in making directory: ", error);
    });
    console.log("Directory created successfully!");
}

const executeCpp = (filepath, inputPath, timeLimit, memoryLimit) => {
    const jobID = path.basename(filepath).split(".")[0];
    console.log(jobID);
    const filename = `${jobID}.out`;
    const outpath = path.join(outputPath, filename);
    console.log(outpath);

    return new Promise((resolve, reject) => {
        const command = `g++ ${filepath} -o ${outpath} && cd ${outputPath} && ./${filename} < ${inputPath}`;
        const child = exec(command, { timeout: timeLimit*60 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    return reject(new Error("Time Limit Exceeded"));
                }
                return reject(error);
            }
            if (stderr) {
                return reject(new Error(stderr));
            }
            resolve(stdout);
        });

        // Kill the process if it exceeds the time limit
        const timer = setTimeout(() => {
            child.kill();
        }, timeLimit*60);

        child.on('exit', (code, signal) => {
            clearTimeout(timer);
            if (signal === 'SIGTERM') {
                return reject(new Error("Time Limit Excded"));
            }
        });
    });
}

module.exports = {
    executeCpp,
}
