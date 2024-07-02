import mongoose from 'mongoose';


const problemSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true,
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
    }
});

// export mongoose model
const Problem = mongoose.model('Problem',problemSchema); 
export default Problem;
