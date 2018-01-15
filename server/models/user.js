var mongoose = require('mongoose');
var User = mongoose.model('User', {
    email:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    name:{
        type: String
    },
    password:{
        type:String
    }
});
module.exports = {User};