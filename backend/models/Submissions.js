import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    runtimeSub: {
        type: Number,
        required: true,
    },
    problemId: {
        type: String,
        required: true,
    },
    problemCode: {
        type: String,
        required: true,
    },
    languageSub: {
        type: String,
        required: true,
    },
    isPassed: {
        type: Boolean,
        required: true,
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
