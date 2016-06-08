var config=require('../Config/constants');
var SuccessMessages=require('../Config/SuccessMessages');

var tokenError=function(error){
    this.name=error.name;
    this.response=error.message,
     this.code= config.STATUS_CODES.BAD_REQUEST;


}

var joiError=function(error){
    this.name=SuccessMessages.JOIVALIDATIONERROR;
    this.code=config.STATUS_CODES.BAD_REQUEST;
    this.message=error.message;
    this.data=[];


}



var createTokenError=function(error){

   var result=new tokenError(error);
    return result;
}
var createJoiError=function(error){
    return new joiError(error);
}




module.exports={
    createTokenError:createTokenError,
    createJoiError:createJoiError

}