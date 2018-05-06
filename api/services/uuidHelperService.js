/** 
 * uuidHelperService
 */
const uuidV4 = require('uuid/v4');
const MongoObjectIdRegex =/^[0-9a-fA-F]{24}$/ ;

var ObjectId = require('sails-mongo/node_modules/mongodb').ObjectID;
module.exports ={
  makePublicId:()=>{
      return uuidV4();
  },
  newObjectId:()=>{
      return new ObjectId();
  },
  makeObjectId:(id)=>{
      return new ObjectId(id);
  },
  isEmail:()=>{

  },
  isObjectId:(id)=>{
    if(typeof id =='string'){
      return MongoObjectIdRegex.test(id);
    }else return false;
  },
  makeOTP : ()=>{
    let otp = Math.floor((Math.random() * 1000000000) + 1);
    while(otp<189821850 && otp>999999999){
          otp = Math.floor((Math.random() * 1000000000) + 1);
    }
    return otp ;
  },
  hashPassword :(password,next)=>{
    if(sails.config.constants.passwordHashEnable){
      next(AuthJwtService.hashPassword(password));
    }else{
      next(password);
    }
  },
  matchPasswordWithhashed:(password,hashed,next)=>{

  },

}