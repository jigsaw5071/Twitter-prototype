var hapiSwagger=require('hapi-swagger');
var joi=require('joi');
var logicController=require('../Controller/logicController');


var configReversePolish={
    description:'REVERSE NOTATION CONVERSION',
    tags:['api'],
    validate:{
        params:{
            value:joi.string().required().description('Infix Notation')
        }
    },
    handler:function(request,reply){
logicController.createPostFix(request,function(error,result){
    if(error){reply(error);}
    else{
   reply(result);
    }
});

    }




}


module.exports={
    configReversePolish:configReversePolish
}