var mongoose = require('mongoose');
var db = require('../Config/dataBaseConfig').db;
var Schema = mongoose.Schema;
var UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        index: true,
        unique: true,


    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 10
    },
    phoneNumber: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    upDatedAt: {
        type: Date,
        default: Date.now()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isValid:{
        type:Boolean,
        default:false
    }
    ,
    token: {
        type: String,
        required: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,


    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,

    }],
    isDeleted:{
        type:Boolean,
        default:false
    }


});
var User = mongoose.model('User', UserSchema);
module.exports = User;