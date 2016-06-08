var joi=require('joi');
var jsErrorController=require('../Controller/jsErrorController');
var adminController=require('../Controller/adminController');


var configAdminRegister={
    description:'ADMIN REGISTER',
    tags:['api'],
    plugins: {
        'hapi-swagger': {
            payloadType: 'form'
        }
    },
    validate: {
        payload: {
            name: joi.string().required().min(3).max(30).description('Admin Username'),
            email: joi.string().required().email().description(' Admin EmaiId'),
            password: joi.string().required().description('Admin Password'),
            age: joi.number().integer().required().description('Admin Age'),
            phoneNumber: joi.string().required().description('Admins Phone Number ')


        },
        failAction:function(request,reply,source,error){
            reply(jsErrorController.createJoiError(error));
        }
    },
    handler: function (request, reply) {

        adminController.adminRegistration(request.payload, function (err, object) {
            if (err) {
                reply(err);
            }
            else {
                reply(object);
            }
        });
    }



}

var configAdminVerifyEmail={
    handler:function(request,reply){
        adminController.adminVerification(request.params.token,function(error,result){
            if(error){reply(error);}
            else{reply(result);}
        });
    },
    validate: {
        params: {
            token: joi.string().required()
        },

        failAction: function (request, reply, source, error) {
            reply(jsErrorController.createJoiError(error));
        }
    }
}

var configAdminLogin={
   description:'ADMIN LOGIN',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate:{
        payload:{
            email:joi.string().email().required().description('EmailId'),
            password:joi.string().required().description('Password')

        },
        failAction:function(request,reply,source,error){
            reply(jsErrorController.createJoiError(error));
        }
    },
    handler:function(request,reply){
        adminController.adminLogin(request.payload,function(error,result){
           if(error){
               reply(error);
           }
            else{
               reply(result);
           }

        });
    }




}

var configDeleteTweet={
    description:'DELETE TWEET',
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
            tweetId: joi.string().required().description('Id of the tweet you want to delete ')
        },
        failAction:function(request,reply,source,error){
            reply(jsErrorController.createJoiError(error));
        }
    },
    handler:function(request,reply){

    }

}
var configAdminGetToken={
    description:'GET ADMIN TOKEN',
    tags:['api'],
    plugins:{
        'hapi-swagger':{
            payloadType:'form'
        }
    },
    validate:{
        payload:{
            email:joi.string().required().email(),

        },
        failAction:function(request,reply,source,error){
            reply(jsErrorController.createJoiError(error));
        }
    },
    handler:function(request,reply){
        adminController.getToken(request.payload,function(error,result){
            if(error){reply(error);}
            else{reply(result);}
        })
    }

}
var configEditUserProfile={
    description:'EDIT USER PROFILE',
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
         options:joi.allow("DELETE TWEETS","SHOW USER PROFILE").required()
        },
        failAction:function(request,reply,source,error){
            reply(jsErrorController.createJoiError(error));
        }

    },
    handler:function(request,reply){
        switch (request.payload.options){
            case DELETEWEETS:
                console.log('DELETETWEETS');
            break;
            case 'SHOW USER PROFILE':
                console.log('SHOW USER PROFILE');
            break;
        }
    }



}

module.exports={
    configAdminRegister:configAdminRegister,
    configAdminVerifyEmail:configAdminVerifyEmail,
    configAdminLogin:configAdminLogin,
    configDeleteTweet:configDeleteTweet,
    configAdminGetToken:configAdminGetToken,
    configEditUserProfile:configEditUserProfile
}