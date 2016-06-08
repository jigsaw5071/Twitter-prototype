var crypto=require('crypto');
//var privateKey=config.KEY.PRIVATEKEY;

module.exports.decrypt = function(password) {
    return decrypt(password);
}
module.exports.encrypt = function(password) {
    return encrypt(password);
}

function decrypt(password) {
    var decipher = crypto.createDecipher('aes-256-ctr', privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
function encrypt(password) {
    var cipher = crypto.createCipher('aes-256-ctr', privateKey);
    var crypted = cipher.update(password, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}