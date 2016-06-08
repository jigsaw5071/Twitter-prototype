var mongoose=require('mongoose');
var db=require('../Config/dataBaseConfig').db;
var Schema=mongoose.Schema;


var tweetSchema=new Schema({
    personId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    tweet:{type:String,required:true},
    timeStamp:{type:Date,default:Date.now()},
    reTweet:[{type:String,index:true}]



});

var Tweet=mongoose.model('Tweet',tweetSchema);
module.exports=Tweet;