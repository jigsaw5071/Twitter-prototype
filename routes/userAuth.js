var hapiSwagger=require('hapi-swagger');
var joi=require('joi');
var userAuthController=require('../Controller/userAuthController');


var configRegister={

     description: 'REGISTER',
     notes: ['REGISTRATION REQUIRED'],
     tags: ['api'],
     plugins: {
         'hapi-swagger': {
             payloadType: 'form'
         }
     },
     validate: {
         payload: {
             name: joi.string().required().min(3).max(30).description(' Username'),
             email: joi.string().required().email().description('EmaiId'),
             password: joi.string().required().description('Password'),
             age: joi.number().integer().required().description('Persons Age'),
             phoneNumber: joi.string().required().description('Users Phone Number ')


         },


     },


     handler: function (request, reply) {
         userAuthController.userRegistration(request.payload, function (err, object) {
             if (err) {
                 reply(err);
             }
             else {
                 reply(object);
             }
         });
     }

};

var verifyConfig={


    handler:function(request,reply){
userAuthController.userVerification(request.params.token,function(error,result){
if(error){reply(error);}
 else{reply(result);}
});
    },
    validate:{
        params:{
            token:joi.string().required()
        }
    }
}
var configLogin={

    //description:'LOGIN',
   // tags:['api'],
  /*  plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },*/
    validate:{
        payload:{
            email:joi.string().email().required().description('EmailId'),
            password:joi.string().required().description('Password')

        }
    },
    handler:function(request,reply){
userAuthController.userLogin(request.payload,function(error,result){
if(error){
    reply(error);
}
else{
    reply(result);
}
});


    }

}

var configToken={
    description:'GET A TOKEN',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate:{
        payload:{
            email:joi.string().email().required()
        },

    },
    handler:function(request,reply){
        userAuthController.getToken(request.payload,function(error,token){
           if(error){reply(error);}
            else{
               reply(token);
           }
        });
    }

}

var configProfile={
    description:'PROFILE',
    tags:['api'],
    validate:{
        headers:joi.object({
            token:joi.string().required()
        }).unknown()
    },
    handler:function(request,reply){
userAuthController.getProfile(request,function(error,result){
   if(error){reply(error);}
    else{
       reply(result);
   }
});
    }



};

var configUnfollow={
    description:'UNFOLLOW',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate:{
        headers: joi.object({
            token: joi.string().required()
        }).unknown(),
        payload: {
            email: joi.string().required().description('Email of the Person You want to unfollow ')
        }
    },
    handler:function(request,reply){
userAuthController.getUnfollow(request,function(error,result){
   if(error){reply(error);}
    else{
       reply(result);
   }
});
    }
};
var configEditProfile={
  description:'EDIT PROFILE',
    tags:['api'],
    validate:{
        headers: joi.object({
            token: joi.string().required()
        }).unknown(),
        payload:{
            name: joi.string().required().min(3).max(30).description(' Username'),
            email: joi.string().required().email().description('EmaiId'),
            password: joi.string().required().description('Password'),
            age: joi.number().integer().required().description('Persons Age'),
            phoneNumber: joi.string().required().description('Users Phone Number ')
        }
    },
    handler:function(request,reply){

    }





};
var configGetTweetId={
    description:'GET TWEET ID',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate: {
        headers: joi.object({
            token: joi.string().required()
        }).unknown(),
    },
    handler:function(request,reply){
        userAuthController.createTweetId(request,function(error,result){
           if(error){reply(error);}
            else{reply(result);}
        });
    }




}
var configUserRetweet={
    description:'RETWEET',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate:{
        headers: joi.object({
            token: joi.string().required()
        }).unknown(),
        payload:{
            Id:joi.string().required().description("ID OF THE TWEET")
        }

    },
    handler:function(request,reply)
    {
     userAuthController.createRetweet(request,function(error,result){
        if(error){reply(error);}
         else{reply(result);}
     });
    }

}

var configProfilePicture={
    description:'UPLOAD YOUR PROFILE PICTURE',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate: {
        payload: {
            file: joi.any().meta({swaggerType: "file"}).description("Browse the path of the Image")
        }
    },
    payload:{
        maxBytes:209715200,
        output:'stream',
        parse: true,
        allow:'multipart/form-data',
    },

    handler:function(request,reply){
     userAuthController.createProfilePicture(request,function(error,result){
         if(error){reply(error);}
         else{
             reply(result);
         }
     })
    }




}

module.exports={
    configRegister:configRegister,
    verifyConfig:verifyConfig,
    configLogin:configLogin,
    configToken:configToken,
    configProfile:configProfile,
    configUnfollow:configUnfollow,
    configEditProfile:configEditProfile,
    configGetTweetId:configGetTweetId,
    configUserRetweet:configUserRetweet,
    configProfilePicture:configProfilePicture,
}








