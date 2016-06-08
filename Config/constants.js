/**
 * Created by SHUBHAM on 29-01-2016.
 */

module.exports={
    SERVER:{
        HOST:'localhost',
        PORT:{
            LIVE:8000,
            TEST:8888,
            DEMO:8088
        }

    },
    DATABASE:{
        HOST:'localhost',
        PORT:27017,
        DB:'Cronj',
        USERNAME:'',
        PASSWORD:''
    },
    KEY:{
        PRIVATEKEY:'37LvDSm4XvjYOh9Y',
        TOKENEXPIRY:1*30*60*1000
    },
    EMAIL:{
        USERNAME:'shubham.sharma@mail.click-labs.com',
        PASSWORD:'clickpass22',
        ACCOUNTNAME:'Developer',
        VERIFYEMAIL:"verifyEmail"
    },
    STATUS_CODES:{
        OK:200,
        CREATED:201,
        DO_NOT_PROCESS:204,
        BAD_REQUEST:400,
        UNAUTHORIZED:401,
        PAYMENT_FAILURE:402,
        FORBIDDEN:403,
        NOT_FOUND:404,
        ALREADY_EXISTS_CONFLICT:409,
        UNSUPPORTED_MEDIA_TYPE:415,
        SERVER_ERROR:500


    },
    USER_RESPONSE_CODES:{
        SUCCESSFUL_LOGIN:'USER LOGGED IN SUCCESSFULLY',
        SUCCESSFUL_REGISTER:'USER REGISTERED SUCCESSFULLY PLEASE CLICK VERIFICATION LINK IN YOUR MAIL',


    },
    SWAGGEROPTIONS:{
        'info': {
            'title': 'TWITTER CLONING',
            version: '2.14.6',
        }
        }


};
