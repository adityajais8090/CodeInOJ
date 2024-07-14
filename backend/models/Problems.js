import mongoose from 'mongoose';


const problemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    constraints : {
        type : [String],
        required : true,
    },
    tags : {
      type : [String],
      required : true,
    },
    code : {
        type : Number,
        required : true
    },
    testcaseId : {
        type : [String],
    },
    timelimit : {
        type : Number,
        required : true,
    },
    memorylimit : {
        type : Number,
        required : true,
    },
    difficulty : {
        type : String,
        required : true,
    }
});

// export mongoose model
const Problem = mongoose.model('Problem',problemSchema); 
export default Problem;
