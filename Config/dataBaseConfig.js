
var mongoose=require('mongoose');

var db=mongoose.connection;

mongoose.connect('mongodb://127.0.0.1/new5');
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function callback()
{
    console.log("Connection with database succeeded");
});


module.exports.db=db;