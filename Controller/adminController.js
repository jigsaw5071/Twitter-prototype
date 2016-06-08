var passLogic=require('./passLogic');
var tokenFunctions=require('../Config/tokenConfig');
var queryService=require('../Service/queryService');
var Model=require('../Model/index');
var MongoErrorController=require('./MongoDBErrorController');
var mailLogic=require('./mailLogic');
var SuccessMessages=require('../Config/SuccessMessages');
var SuccessController=require('./SuccessController');
var jsErrorController=require('./jsErrorController');
var config=require('../Config/constants');
var async=require('async');

var adminRegistration=function(payload,callback){
    payload.password=passLogic.encrypt(payload.password);
    var tokendata=tokenFunctions.tokendata(payload);
    var token=tokenFunctions.cipherToken(tokendata);
    payload=Model.SchemaFunctions.updateToken(payload,token);
    queryService.setData(Model.adminSchema,payload,function(error,result){
        if(error){
            var errorObject=MongoErrorController.createError(error.name,error.code,error.message);
            return callback(errorObject);
        }
        mailLogic.sentMailVerificationLink(payload.email,token);
        var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.USERREGISTERED);

        return callback(null,result);

    });

}
var adminVerification=function(token,callback) {
    console.log(token);
    tokenFunctions.decipherToken(token, function (error, decoded) {
        if (error) {
            var errorObject = jsErrorController.createTokenError(error);
            return callback(errorObject);
        }
        var email = decoded.email;
        queryService.getData(Model.adminSchema, {}, {email: email}, function (error, result) {
            if (error) {
                return callback(error);
            }
            if (result[ 0 ].isDeleted) {
            return callback(MongoErrorController.createError(SuccessMessages.USERDELETED,config.STATUS_CODES.UNAUTHORIZED,SuccessMessages.INVALIDUSER));
            }

            if (result[ 0 ].isVerified === true) {
                var result = SuccessController.SuccessObject(200, SuccessMessages.USERALREADYVERIFIED);
                return callback(null, result);
            }
            queryService.updateData(Model.adminSchema, {email: email}, {$set: {isVerified: true}}, function (error, result) {
                if (error) {
                    return callback(error);
                }
                return callback(null, result);
            });

        });
    });
}
var adminLogin=function(payload,callback){
    queryService.getData(Model.adminSchema,{email:payload.email},function(error,result){
       if(error){
           var errorObject=MongoErrorController.createError(error.name,error.code,error.message);
           return callback(errorObject);
       }
       if(result.length){
           if (result[ 0 ].isDeleted) {
               return callback(MongoErrorController.createError(SuccessMessages.USERDELETED,config.STATUS_CODES.UNAUTHORIZED,SuccessMessages.INVALIDUSER));
           }


               if(result[0].password===passLogic.encrypt(payload.password)){
                   var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.LOGINSUCCESSFUL);
               }
               else{
                   var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.WRONGPASSWORD);
               }

           return callback(null,result);
       }
        else{
           var errorObject=MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND);

           return callback(errorObject);
       }


    });
}

var getToken=function(payload,callback){
    queryService.getData(Model.adminSchema,{email:payload.email},function(error,result){
        if(error){return callback(error);}
        if(result.length) {
            var token = result[0].token;

            return callback(null, token);
        }
        else{
            return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.TOKENNOTFOUND));
        }
    });

}














module.exports={
   adminRegistration:adminRegistration,
   adminVerification:adminVerification,
   adminLogin:adminLogin,
   getToken:getToken,

}