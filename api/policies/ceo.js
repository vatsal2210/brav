/**
 * Created by Omkar Dusane on 23-Oct-16.
 */

module.exports = function ceo (req, res, next) {
  console.log("Brav admin request recieved");
  AuthJwtService.authenticate([1],req,res,function(){
    next();
  });
} ;
