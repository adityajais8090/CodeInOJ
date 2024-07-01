const fs = require('fs');
const path = require('path');
const {v4 : uuid} = require('uuid');

const dirCodes = path.join(__dirname , "codes"); //C:\Users\jarvis\OneDrive\Desktop\cp\algoUniversity_homework\algo_dev_season\class_codes\compiler\backend\generateFile.js
console.log(dirCodes);
// check if dir is exist , we don't need to create that
if(!fs.existsSync(dirCodes)){
    fs.mkdir(dirCodes , {recursive : true }, (error)=>{
        console.log("error in making directory : ", error);
    });
    console.log("Directory form Successfully!")
}


const generateFile = ( language, code ) =>{
  
    const jobID = uuid(); //f773008d-995c-4bb2-bb6a-506437d01cc1
    const filename = path.join(`${jobID}.${language}`); //bfc09f72-d5b5-4fcb-92ee-e7fd594c6c24.java
    const filePath = path.join( dirCodes, filename );
    fs.writeFileSync(filePath, code);
    return filePath;    
}

module.exports = { 
    generateFile,
}