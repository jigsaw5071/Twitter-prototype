var mongoose=require('mongoose');
var db = require('../Config/dataBaseConfig').db;
var Schema = mongoose.Schema;
var adminSchema=new Schema({

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
    token: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:true
    }









});

var Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;