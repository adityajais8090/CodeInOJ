import mongoose from 'mongoose';

const testcaseSchema = new mongoose.Schema({
    input : {
        type : String,
        required : true,
    },
    output : {
        type : String,
        required : true
    },
    problemtitle : {
        type : String,
        required : true,
    },
    code : {
        type : Number,
        required : true,
    },
    problemId : {
        type : String,
    },
});

// export mongoose model
const TestCases = mongoose.model('TestCases',testcaseSchema);
export default TestCases;