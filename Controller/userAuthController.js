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
var fs=require('fs');
var multiparty=require('multiparty');

var userRegistration=function(payload,callback){
payload.password=passLogic.encrypt(payload.password);
var tokendata=tokenFunctions.tokendata(payload);
 var token=tokenFunctions.cipherToken(tokendata);
payload=Model.SchemaFunctions.updateToken(payload,token);

queryService.setData(Model.userSchema,payload,function(error,result){
if(error){
var errorObject=MongoErrorController.createError(error.name,error.code,error.message);
return callback(errorObject);
}
  mailLogic.sentMailVerificationLink(payload.email,token);
    var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.USERREGISTERED);

 return callback(null,result);

});

}

var userVerification=function(token,callback){
tokenFunctions.decipherToken(token,function(error,decoded){
   if(error){
       var errorObject=jsErrorController.createTokenError(error);
       return callback(errorObject);
   }

    var email=decoded.email;
queryService.getData(Model.userSchema,{},{email:email},function(error,result){
   if(error){
       return callback(error);
   }
if(result[0].isVerified===true){
    var result=SuccessController.SuccessObject(200,SuccessMessages.USERALREADYVERIFIED);
    return callback(null,result);
}
queryService.updateData(Model.userSchema,{email:email},{$set:{isVerified:true}},function(error,result){
if(error){return callback(error);}
    return callback(null,result);
});
});

});
}

var userLogin=function(payload,callback){
queryService.getData(Model.userSchema,{email:payload.email},function(error,result){
   if(error){return callback(error);}

    if(result.length){
if(result[0].isVerified===false){
    var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.LOGINWITHOUTVERIFICATION);
}
    else{
    if(result[0].password===passLogic.encrypt(payload.password)){
       var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.LOGINSUCCESSFUL);
    }
    else{
        var result=SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.WRONGPASSWORD);
    }
}
    return callback(null,result);}
    else{

        var errorObject=MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND);

        return callback(errorObject);
    }
});
}

var getToken=function(payload,callback){

queryService.getData(Model.userSchema,{email:payload.email},function(error,result){
   if(error){return callback(error);}
    if(result.length) {
        var token = result[0].token;

        return callback(null, token);
    }
    else{
        return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.TOKENNOTFOUND));
    }
});
};

var getProfile=function(request,callback){
var token=request.headers.token;
    async.auto({
      getObject:function(callback){
          queryService.getData(Model.userSchema,{token:token},function(error,result){
              if(error){
                  return callback(MongoErrorController.createError(error.name,error.code,error.message));
              }
              if(result.length){

                  callback(null,result);
              }
              else{
                  return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
              }
          });
      },
      makeObject:['getObject',function(callback,result){


        var object=result.getObject[0];


          var followers=object.followers,following=object.following;

          queryService.getData(Model.userSchema,{_id:{$in:following}},{email:1,_id:0},function(error,result){
              if(error){
                  return callback(MongoErrorController.createError(error.name,error.code,error.message));
              }
           following=result;

              queryService.getData(Model.userSchema,{_id:{$in:object.followers}},{email:1,_id:0},function(error,result){
                  if(error){
                      return callback(MongoErrorController.createError(error.name,error.code,error.message));
                  }
                followers=result;

       var trueObject=Model.SchemaFunctions.profileObject(object,followers,following);
                  callback(null,trueObject);
              });

          });


      }

      ]



    },function(error,result){
        if(error){return callback(error);}

        return callback(null,result.makeObject);

    });

};
var getUnfollow=function(request,callback){
var token=request.headers.token;
var email=request.payload.email;
    async.auto({
        getSelfId:function(callback){
            queryService.getData(Model.userSchema,{token:token},function(error,result){
                if(error){
                    return callback(MongoErrorController.createError(error.name,error.code,error.message));
                }
                if(result.length){
                    if(result[0 ].isDeleted===true){
                        return callback(MongoErrorController.createError(SuccessMessages.USERDELETED,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
                    }
                    else {


                        var id = result[ 0 ]._id;
                        callback(null, id);
                    }
                }
                else{
                    return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
                }
            });
        },
        getUserId:function(callback){
            queryService.getData(Model.userSchema,{email:email},function(error,result){
                if(error){
                    return callback(MongoErrorController.createError(error.name,error.code,error.message));
                }
                if(result.length){
                    var id=result[0]._id;
                    callback(null,id);
                }
                else{
                    return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
                }
            });

        },
        getBothUsers:['getSelfId','getUserId',function(callback,result){
            if(result.getSelfId && result.getUserId){
             callback(null,result);
            }
            else{
               return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
            }

        }],
        updateUnfollowing:['getBothUsers',function(callback,result){
            var idSource=result.getSelfId;
            var idDest=result.getUserId;
            queryService.updateData(Model.userSchema,{_id:idSource},{$pull:{following:idDest}},function(error,result){
                if(error){
                    return callback(MongoErrorController.createError(error.name,error.code,error.message));
                }
               if(result.nModified===1){

                   callback(null,result);
               }
                else{
                  return callback(MongoErrorController.createError(SuccessMessages.REQUESTPROCESSED,config.STATUS_CODES.OK,SuccessMessages.ALREADYUNFOLLOWED))
               }
            });
        }],
        updateUnfollower:['getBothUsers',function(callback,result){
            var idSource=result.getSelfId;
            var idDest=result.getUserId;
            queryService.updateData(Model.userSchema,{_id:idDest},{$pull:{followers:idSource}},function(error,result){
                if(error){
                    return callback(MongoErrorController.createError(error.name,error.code,error.message));
                }
                if(result.nModified===1){

                    callback(null,result);
                }
                else{
                    return callback(MongoErrorController.createError(SuccessMessages.REQUESTPROCESSED,config.STATUS_CODES.OK,SuccessMessages.ALREADYUNFOLLOWED));
                }
            });
        }],
        doneEverything:['updateUnfollowing','updateUnfollower',function(callback,result){
        if(result.updateUnfollower.nModified && result.updateUnfollowing.nModified){
            callback(null,result);
        }
            else{
            return callback(MongoErrorController.createError(SuccessMessages.REQUESTPROCESSED,config.STATUS_CODES.OK,SuccessMessages.ALREADYUNFOLLOWED));
        }



        }]


    },function(error,result){
if(error){return callback(error);}
        return callback(SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.UNFOLLOWDONE));
    });

}

var createTweetId=function(request,callback){
  var token=request.headers.token;
  async.waterfall([
      function(callback){
          queryService.getData(Model.userSchema,{token:token},function(error,result){
              if(error){
                  return callback(MongoErrorController.createError(error.name,error.code,error.message));
              }
              if(result.length){
                  if (result[ 0 ].isDeleted) {
                      return callback(MongoErrorController.createError(SuccessMessages.USERDELETED,config.STATUS_CODES.UNAUTHORIZED,SuccessMessages.INVALIDUSER));
                  }

                  callback(null,result);
              }
              else{
                  return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
              }
          });

      },
      function(result,callback){
          var following=result[0 ].following;

          queryService.getDataWithReference(Model.tweetSchema,{personId:{$in:following}},{__v:0,timeStamp:0},{lean:true,sort:{timeStamp:-1}},{path:'personId',select:'email -_id'},function(error,result){
              if(error){
                  return callback(MongoErrorController.createError(error.name,error.code,error.message));
              }
              if(result.length){

                  callback(null,result);
              }
              else{
                  return callback(MongoErrorController.createError(SuccessMessages.VALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.NOTWEETSPOSTED));
              }

          });

      }

  ],function(error,result){
      if(error){return callback(error);}
      else{
          return callback(SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.TWEETSSHOWN,result));
      }
  });

};
var createRetweet=function(request,callback){
    var token=request.headers.token;
    var tweetId=request.payload.Id;
   async.waterfall([
      function(callback){
          queryService.getData(Model.userSchema,{token:token},function(error,result){
              if(error){
                  return callback(MongoErrorController.createError(error.name,error.code,error.message));
              }
              if(result.length){
                  if (result[ 0 ].isDeleted) {
                      return callback(MongoErrorController.createError(SuccessMessages.USERDELETED,config.STATUS_CODES.UNAUTHORIZED,SuccessMessages.INVALIDUSER));
                  }

                  callback(null,result);
              }
              else{
                  return callback(MongoErrorController.createError(SuccessMessages.INVALIDUSER,config.STATUS_CODES.BAD_REQUEST,SuccessMessages.USERNOTFOUND));
              }
          });
      } ,
           function(result,callback){
           var personEmail=result[0 ].email;
           queryService.updateData(Model.tweetSchema,{_id:tweetId},{$addToSet:{reTweet:personEmail}},function(error,result){
               if(error){
                   return callback(MongoErrorController.createError(error.name,error.code,error.message));
               }
               if(result.nModified===1){

                   callback(null,result);
               }
               else{
                   return callback(MongoErrorController.createError(SuccessMessages.REQUESTPROCESSED,config.STATUS_CODES.OK,SuccessMessages.ALREADYRETWEETED));
               }
           });

       }


   ],function(error,result){
    if(error){
        return callback(error);
    }
       return callback(null,SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.RETWEETSUCCESSFUL));
   });


}

var createProfilePicture=function(request,callback){

var data=request.payload;
if(data.file){
    var name=data.file.hapi.filename;
    var path="/home/shubham/WebstormProjects/MongoNew/uploads/"+name;
    var file = fs.createWriteStream(path);
    file.on('error', function (err) {
        console.error(err)
    });
    data.file.pipe(file);

}



}

module.exports={
    userRegistration:userRegistration,
    userVerification:userVerification,
    userLogin:userLogin,
    getToken:getToken,
    getProfile:getProfile,
    getUnfollow:getUnfollow,
    createTweetId:createTweetId,
    createRetweet:createRetweet,
    createProfilePicture:createProfilePicture,
}