var Model=require('../Model/index');
var MongoErrorController=require('./MongoDBErrorController');
var config=require('../Config/constants');
var queryService=require('../Service/queryService');
var SuccessMessages=require('../Config/SuccessMessages');
var async=require('async');
var SuccessMessages=require('../Config/SuccessMessages');
var SuccessController=require('./SuccessController');

var createTweets=function(request,callback){
  var token=request.headers.token;
    var tweet=request.payload.tweet;
   async.auto({

       getId:function(callback){

           queryService.getData(Model.userSchema,{token:token},function(error,result){
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
       createData:['getId',function(callback,results){
    var id=results.getId;

           var tweetdata=Model.SchemaFunctions.createTweetData(id,tweet);

     queryService.setData(Model.tweetSchema,tweetdata,function(error,result){
if(error){
    var errorObject=MongoErrorController.createError(error.name,error.code,error.message);
    return callback(errorObject);
}
    callback(null,result);
     });

       }]
   },function(error,result){
       if(error){
           return callback(error);
       }

       return callback(null,SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.TWEETPOSTED));

   });
};


var createFollow=function(request,callback){
var token=request.headers.token;
var email=request.payload.email;
async.auto({
    getSelfId:function(callback){

        queryService.getData(Model.userSchema,{token:token},function(error,result){
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
    // console.log(result);
      callback(null,result);
    }],
    updateFollowing:['getBothUsers',function(callback,result){
        var idSource=result.getSelfId;
        var idDest=result.getUserId;

        queryService.updateData(Model.userSchema,{_id:idSource},{$addToSet:{following:idDest}},function(error,result){
            if(error){
                return callback(MongoErrorController.createError(error.name,error.code,error.message));
            }
            callback(null,result);
        });

    }],
    updateFollower:['getBothUsers',function(callback,result){
        var idSource=result.getSelfId;
        var idDest=result.getUserId;
        queryService.updateData(Model.userSchema,{_id:idDest},{$addToSet:{followers:idSource}},function(error,result){
            if(error){
                return callback(MongoErrorController.createError(error.name,error.code,error.message));
            }
            callback(null,result);
        });
    }],

    doneEverything:['updateFollowing','updateFollower',function(callback,result){



        callback(null,result);
    }]




},function(error,result){

    if(error){
        return callback(error);
    }
    //return callback(result);
   return callback(null,SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.FOLLOWDONE));
})

};

var createSelfTweets=function(request,callback){
    var token=request.headers.token;
    async.waterfall([
        function(callback){
            queryService.getData(Model.userSchema,{token:token},function(error,result){
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
        function(result,callback){
           queryService.getData(Model.tweetSchema,{personId:result},{tweet:1,reTweet:1,_id:0},{lean:true,sort:{timeStamp:-1}},function(error,result){
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
 if(error){
     return callback(error);
 }
        return callback(SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.TWEETSSHOWN,result))
    })

}

var createTimelineTweets=function(request,callback){
    var token=request.headers.token;
   async.waterfall([
       function(callback){


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
       function(result,callback){
        var following=result[0].following;
           following.push(result[0]._id);

           queryService.getDataWithReference(Model.tweetSchema,{personId:{$in:following}},{_id:0,__v:0,timeStamp:0},{lean:true,sort:{timeStamp:-1}},{path:'personId',select:'email -_id'},function(error,result){
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
       },
       function(result,callback){
           var tweets=result.length;
           var answer=[];
           for(var i=0;i<tweets;++i){
               answer.push(Model.SchemaFunctions.createTimeLineTweetResult(result[i ].personId.email,result[i ].tweet));
               for(var j=0;j<result[i ].reTweet.length;++j){
                  answer.push(Model.SchemaFunctions.createTimeLineTweetResult(result[i ].reTweet[j],result[i ].tweet,result[i].personId.email));
               }
           }

        callback(null,answer);
       }

   ],function(error,result){
if(error){return callback(error);}
       else{
    return callback(SuccessController.SuccessObject(config.STATUS_CODES.OK,SuccessMessages.TWEETSSHOWN,result));
}
   });

}

module.exports={
    createTweets:createTweets,
    createFollow:createFollow,
    createSelfTweets:createSelfTweets,
    createTimelineTweets:createTimelineTweets
}