

module.exports = function orgAdmin (req, res, next) {
  AuthJwtService.authenticate([3,2,1],req,res,function(){
    next();
  });
} ;
