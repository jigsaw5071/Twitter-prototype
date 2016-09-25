var hapi=require('hapi');
var server=new hapi.Server();
var hapiSwagger=require('hapi-swagger');
var inert=require('inert');
var vision=require('vision');
var config=require('./Config/constants');
var privateKey=config.KEY.PRIVATEKEY;
var ttl=config.KEY.TOKENEXPIRY;
var jwt=require('jsonwebtoken');
var Moment=require('moment');
var Routes=require('./routes');
var geoip2 = require('geoip2');
var mongoose=require('mongoose');

server.connection({
    host:config.SERVER.HOST,
    port:config.SERVER.PORT.LIVE
});

var geek={
    register:hapiSwagger,
    options:config.SWAGGEROPTIONS
};
var arr=[inert,vision,geek];

server.register(arr,function(error)
{
    if(error)
   throw error;

});
server.route(Routes);
server.start(function()
{
    console.log('Your server is running at: '+server.info.uri);
});

