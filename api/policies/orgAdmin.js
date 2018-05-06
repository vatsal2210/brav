/**
 * Created by Omkar Dusane on 23-Oct-16.
 */

module.exports = function orgAdmin (req, res, next) {
  AuthJwtService.authenticate([3],req,res,function(){
    next();
  });
} ;
