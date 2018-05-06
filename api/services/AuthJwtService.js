/**
 * Created by Omkar Dusane on 23-Oct-16.
 * 
 * AuthJwtService.js
 * 
 */

var jwt = require('jsonwebtoken');
var crypto = require('crypto')
let logs = false ;

module.exports = {
    authenticate : (authLevel , req , res, next )=>{
      var token = req.headers['x-access-token'];
      // console.log('Middleware Runniing --authlevel: '+authLevel);
      // decode token
      if (token) {
        jwt.verify(token, sails.config.constants.superSecret , function(err, decoded) {
          if (err) {
            return res.json({ ok: false, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            req.authDecoded = decoded;
            //console.log(decoded);
            if(authLevel.indexOf(decoded.type)>-1){
              next();
            }else{
              return res.status(403).send({
                ok: false,
                message: 'Unauthorized'
              });
            }
          }
        });
      }else {
        // if there is no token
        return res.status(403).send({
          ok: false,
          message: 'No token provided'
        });
      }
    },

    decode : (token,next)=>{
      if(typeof token == 'string') {
        jwt.verify(token, sails.config.constants.superSecret , function(err, decoded) {
          if (!!err) {
            if(err.name){
              if(err.name =='TokenExpiredError'){
                  return next({ ok: false, message: 'TokenExpiredError'});          
              }
            }
            return next({ ok: false, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            return next({ok:true,decoded:decoded});
          }
        });
      }
      else {
        next({ok:false,message:'issue'});
      }
    },

    encode :(data,next)=>{
      var token = jwt.sign(data, sails.config.constants.superSecret , {
        expiresIn :  60 * 60 * 24  // expires in 24 hours
      });
      next(token);
    },

    hashPassword:(password)=>{
      return crypto.createHmac('sha1', sails.config.constants.hashSecret)
              .update(password).digest('hex') ;
    }

}
