var jwt=require('jsonwebtoken');
var config=require('./constants');
var PRIVATEKEY=config.KEY.PRIVATEKEY;


var cipherToken=function(tokenData){
    return jwt.sign(tokenData,PRIVATEKEY,{expiresIn:"7h"});
}

var decipherToken=function(token,callback){
     jwt.verify(token,PRIVATEKEY,function(error,decoded){
         if(error){
             return callback(error);

         }
         return callback(null,decoded);
     });
}

var tokendata=function(payload){
    var result={
     email:payload.email
    }
    return result;

}


module.exports={
    cipherToken:cipherToken,
    decipherToken:decipherToken,
    tokendata:tokendata
}