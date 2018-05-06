/**
 * Created by Omkar Dusane on 23-Oct-16.
 */

module.exports = function individual (req, res, next) {
   AuthJwtService.authenticate([4],req,res,function(){
        next();
   });
};
