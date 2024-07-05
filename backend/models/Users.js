import mongoose from 'mongoose';

// Create schema for submissions
const submissionSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique : true,
  },
  status: {
    type: String,
    required: true,
  },
});

// Create schema for user
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  submissions: [submissionSchema],
  token: {
    type: String,
  },
});

// Export mongoose model
const User = mongoose.model('User', userSchema);
export default User;
