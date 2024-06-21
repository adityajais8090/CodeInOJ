const mongoose = require ('mongoose');

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

// always write it in singular only ,it is exports through that only
module.exports = mongoose.model('User',userSchema); 