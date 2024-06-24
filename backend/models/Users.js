import mongoose from 'mongoose';

// create schema of user for register page
const userSchema =  new mongoose.Schema({
  firstname : {
    type : String,
    required : true
  },
  lastname : {
    type : String,
    required : true
  },
  email : {
    type : String,
    unique : true,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  token : {
    type : String,
  }

});

// export mongoose model
const User = mongoose.model('User',userSchema);
export default User;