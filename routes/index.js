var UserControl=require('./userAuth');
var tweetControl=require('./tweetAuth');
var logicControl=require('./logicAuth');
var adminControl=require('./adminAuth');
module.exports= [
    /*
    USER METHODS
     */

    {method:'POST',path:'/user/register',config:UserControl.configRegister},
    {method:'GET',path:'/verifyEmail/{token}',config:UserControl.verifyConfig},
    {method:'POST',path:'/user/login',config:UserControl.configLogin},
    {method:'POST',path:'/user/getToken',config:UserControl.configToken},
    {method:'PUT',path:'/user/tweet',config:tweetControl.configTweet},
    {method:'PUT',path:'/user/follow',config:tweetControl.configFollow},
    {method:'POST',path:'/user/profile',config:UserControl.configProfile},
    {method:'POST',path:'/user/selftweets',config:tweetControl.configSelfTweets},
    {method:'POST',path:'/user/Alltweets',config:tweetControl.configAllTweets},
    {method:'PUT',path:'/user/unfollow',config:UserControl.configUnfollow},
    {method:'PUT',path:'/user/editProfile',config:UserControl.configEditProfile},
    {method:'POST',path:'/user/getTweetId',config:UserControl.configGetTweetId},
    {method:'PUT',path:'/user/retweet',config:UserControl.configUserRetweet},
    {method:'POST',path:'/user/uploadProfilePicture',config:UserControl.configProfilePicture},
    /*
            LOGIC METHODS
     */
    {method:'GET',path:'/reversePolish/{value}',config:logicControl.configReversePolish},
    /*
       ADMIN METHODS
     */
    {method:'POST',path:'/admin/register',config:adminControl.configAdminRegister },
    {method:'GET',path:'/admin/verifyEmail/{token}',config:adminControl.configAdminVerifyEmail},
    {method:'POST',path:'/admin/login',config:adminControl.configAdminLogin},
    {method:'DELETE',path:'/admin/deleteTweet',config:adminControl.configDeleteTweet},
    {method:'POST',path:'/admin/getToken',config:adminControl.configAdminGetToken},
    {method:'PUT',path:'/admin/EditUserProfile',config:adminControl.configEditUserProfile},

    ];