var hapiSwagger=require('hapi-swagger');
var joi=require('joi');
var tweetController=require('../Controller/tweetController');



var configTweet= {
    description: 'ADD A TWEET',
    tags: ['api'],
    plugins: {
        'hapi-swagger': {
            payloadType: 'form'
        }
    },
    validate: {
        headers: joi.object({
            token: joi.string().required()
        }).unknown(),
        payload: {
            tweet: joi.string().required().description('TWEET ')
        }
    },
    handler: function (request, reply) {
tweetController.createTweets(request,function(error,result){
   if(error){reply(error);}
    else{
       reply(result);
   }
});



    }
};

var configFollow={
    description:'FOLLOW',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate:{
        headers:joi.object({
            token:joi.string().required(),
        }).unknown(),
        payload:{
            email:joi.string().required().email().description('EMAIL OF THE PERSON YOU WANT TO FOLLOW ')
        }
    },
    handler:function(request,reply){

        tweetController.createFollow(request,function(error,result){
           if(error){reply(error);}
            else{
               reply(result);
           }
        });
    }



};

var configSelfTweets={
    description:'GET SELF TWEETS',
    notes:['Displays Self Composed Tweets'],
    tags:['api'],
    validate:{
        headers:joi.object({
            token:joi.string().required()
        }).unknown()
    },
    handler:function(request,reply){
tweetController.createSelfTweets(request,function(error,result){
   if(error){reply(error);}
    else{
       reply(result);
   }
});
    }
}

var configAllTweets={
  description:'TIMELINE TWEETS',
  notes:['displays tweets of a users and the users which he is following'],
    tags:['api'],
    validate:{
        headers:joi.object({
            token:joi.string().required()
        }).unknown()
    },
    handler:function(request,reply){
tweetController.createTimelineTweets(request,function(error,result){
   if(error){
       reply(error);
   }
    else{
       reply(result);
   }
});
    }

};


module.exports={
    configTweet:configTweet,
    configFollow:configFollow,
    configSelfTweets:configSelfTweets,
    configAllTweets:configAllTweets
}