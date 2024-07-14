import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    contestRating : {
        type : Number,
        required : true,
    }

});

const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    contestCode: {
        type: Number,
        required: true,
        unique: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: "String",
        required: true,
    },
     problemId : {
        type : [String],
    },
    participants : [ratingSchema],
});

// export mongoose model
const Contest = mongoose.model('Contest', contestSchema);
export default Contest;
