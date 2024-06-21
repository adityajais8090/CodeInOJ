const mongoose = require ('mongoose');

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
    type : String
  }

});

// export mongoose model
module.exports = mongoose.model('User',userSchema); 