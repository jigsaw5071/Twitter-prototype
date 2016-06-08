var nodemailer=require('nodemailer');
var config=require('../Config/constants');
var privateKey=config.KEY.PRIVATEKEY;

var smtpTransport = nodemailer.createTransport( {
    service: "gmail",
    auth: {
        user:config.EMAIL.USERNAME ,
        pass:config.EMAIL.PASSWORD
    }
});

module.exports.sentMailVerificationLink = function(user,token) {
    var from = config.EMAIL.ACCOUNTNAME+" Team<" + config.EMAIL.USERNAME + ">";
    var mailbody = "<p>Thanks for Registering on "+config.EMAIL.ACCOUNTNAME+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='http://"+config.SERVER.HOST+":"+ config.SERVER.PORT.LIVE+"/"+config.EMAIL.VERIFYEMAIL+"/"+token+"'>Verification Link</a></p>";
    mail(from, user , "Account Verification", mailbody);
};

function mail(from,email,subject,mailbody)
{
    var mailOptions={
        from:from,
        to:email,
        subject:subject,
        html:mailbody

    }
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
}