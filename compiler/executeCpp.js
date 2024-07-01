const fs = require('fs');
const path = require('path');
const {v4 : uuid} = require('uuid');
const {exec} = require('child_process');

const outputPath = path.join(__dirname , "outputs"); 


// check if dir is exist , we don't need to create that
if(!fs.existsSync(outputPath)){
    fs.mkdir(outputPath , {recursive : true }, (error)=>{
        console.log("error in making directory : ", error);
    });
    console.log("Directory form Successfully!")
}


const executeCpp = ( filepath, inputPath ) =>{
  
    const jobID = path.basename(filepath).split(".")[0];
    console.log(jobID);
    const filename = `${jobID}.exe`;
    const outpath = path.join(outputPath, filename);
    
    console.log(outpath);
    


    return new Promise ( (resolve,reject) =>{
      const command = `g++ ${filepath} -o ${outpath} && cd ${outputPath} && .\\${filename} < ${inputPath}`;
        exec(command,
        (error, stdout, stderr) => {
          if(error){
             reject(error);
            }
          if(stderr){ 
            reject(error);
          }
          resolve(stdout);
        }
      );
    });

}

module.exports = { 
    executeCpp,
}