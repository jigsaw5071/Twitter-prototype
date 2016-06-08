



var updateToken=function(payload,token){
    payload.token=token;
    payload.isDeleted=false;
    return payload;
}


var createTweetData=function(id,tweet){
   var result= {
       personId: id,
       tweet: tweet
   }
    return result;
}
var objectEnable=function(result,followers,following){
    this.name=result.name;
    this.age=result.age;
    this.email=result.email;
    this.followers=followers;
    this.following=following;

};

var TimelineTweet=function(creater,tweet,retweetedFrom){
    this.email=creater;
    this.tweet=tweet;
    this.retweetedFrom=retweetedFrom;
    return this;
}




var profileObject=function(object,followers,following){

return new objectEnable(object,followers,following);
}
var createTimeLineTweetResult=function(creater,tweet,retweetedFrom){

   return new TimelineTweet(creater,tweet,retweetedFrom);
}





module.exports={
    updateToken:updateToken,
    createTweetData:createTweetData,
    profileObject:profileObject,
    createTimeLineTweetResult:createTimeLineTweetResult


}