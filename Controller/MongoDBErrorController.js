//////////////////////////Error Schema/////////////////////////////////////////////////////

var mongoError=function(name,code,message)
{
    this.name=name;
   this.code=code;

    this.response=message;

}











var createError=function(name,code,message){

      var result=new mongoError(name,code,message);

return result;



}






module.exports={
    createError:createError
}