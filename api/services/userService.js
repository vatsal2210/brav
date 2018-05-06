/**
 *  userService
 * Created by Omkar Dusane on 07-Oct-16.
 */
module.exports = {

  adduser: function (obj,cb) {
    Users.findOne({email:obj.email}).exec(function (err, theUser) {
      if (err) {
        return cb(true);
      }
      else if (!theUser) {// no user exists
        var otp = uuidHelperService.makeOTP();
        OtpLogs.native(function (err2, Collection){
          Collection.update({email: obj.email}, {"$set": {data:obj,otp:otp,active:true}}, {"upsert": true},
            function (err3, updated){
              // send OTP
              console.log('userService: Generated OTP : ',obj.email,": ",otp)
              emailService.sendOtp(obj.email,otp,function (sent, reason) {
                if(sent)
                {
                    return cb(false);// no error
                }else{
                    return cb(true,reason); //error
                }
              });
            })
        });
      }else{ // user already exists
        cb(true);
      }
    });

  },

  verifyOtp: function (obj,cb) {
    OtpLogs.findOne({email:obj.email,active:true},function (err, doc) {
      if(err == null){
        if(!doc){ // no otp was sent
          cb(true);
        }else{
          if(doc.otp == obj.otp){
            // verified :
            OtpLogs.native(function (err2, collection) {
              collection.update({email: obj.email}, {"$set": {active:false}},
                function (err3, updated){
                  collection.findOne({email:obj.email,active:false},function (err4, doc2) {
                    doc2.data.verified = true ;
                    doc2.data.createdAt = TimeHelperService.getNow();
                    Users.create(doc2.data).exec(function (err4, doc) {
                      if(err4 == null){
                        emailService.sendWelcomeEmailToUser(obj.email,doc,function (sent, reason) {
                          if(sent){
                            return cb(false);// no error
                          }else{
                            return cb(true,reason); //error
                          }
                        });
                      }else{
                        cb(true);
                      }
                     });
                   })
                })
            })
          }else{
            cb(true);
          }
        }
      }else{// issue
        cb(true);
      }
    });
  },

  signIn: function (obj, callback) {
    Users.find(obj).exec(function (err, doc) {
      if(err==null){
        if(doc.length == 0){
          // some error
          callback(true,null);
        }else{
          // found obj
          AuthJwtService.encode({email:doc[0].email,type:doc[0].type},(token)=>{
            callback(false,token,doc[0].type);
          });
        }
      }
    })
  },

  getUserInfo : function (obj, callback) {
    Users.native(function(er1,collection){
      collection.find(obj,{ email:1,type:1, name:1 }).toArray(function (err, doc) {
        if(err==null){
          if(doc.length == 0){
            callback(false,null);
          }else{
            callback(true,doc[0]);
          }
        }
      })})
  },

  getMediatorInfo : function (obj, callback) {
    Users.native(function(er1,collection){
      collection.find(obj,{ email:1,type:1, name:1, mediatorApproved:1 ,profile:1}).toArray(function (err, doc) {
        if(err==null){
          if(doc.length == 0){
            callback(false,null);
          }else{
            callback(true,doc[0]);
          }
        }
      })})
  },

	getName : function(email,callback){
	  Users.findOne({email:email} ).exec(function (err, m) {
        if(err==null){ //no error
		      console.log("checking org name:"+m);
          if(m.length == 0){
			      callback(true,null); //error = true
          }
          else{
			      callback(false,m);
          }
        }
      });
  },

  /** user account features */
  forgotPassword:(obj,cb)=>{
    Users.findOne({email:obj.email}).exec(function (err, theUser) {
      if (err) {
        cb({ok:false,message:'db issue'});
      }
      else if (theUser) {// a user exists
        var otp = uuidHelperService.makeOTP();
        OtpLogs.native(function (err2, Collection){
          Collection.update({email: obj.email}, {"$set": {data:obj,otp:otp,active:true,forgotPassword:true}}, {"upsert": true},
            function (err3, updated){
              // send OTP
              console.log('generated OTP : ',obj.email,": ",otp)
              emailService.sendOtpForForgotPassword(obj.email,otp,function (sent) {
                if(sent)
                {
                  return cb({ok:true,message:'OTP sent'});
                }else{
                  return cb({ok:false,message:'could not send otp'})
                }
              });
            })
        });
      }else{ // no already exists
        cb({ok:false,message:'no such user'});
      }
    });
  },

  verifyAfterPasswordRecovery:(email, otp,cb)=>{
   OtpLogs.findOne({email:email,active:true,forgotPassword:true},function (err, doc) {
      if(err ==null){
        if(!doc){ // no such otp was sent
          return cb({ok:false,message:'no such otp was sent, sorry'});
        }else{
          if(doc.otp == otp){
            // verified :
            OtpLogs.native(function (err2, collection) {
              collection.update({email: email}, {"$set": {active:false}},
                function (err3, updated){
                   if(!err3)
                   { // update users table here
                      Users.native((err4,c_users)=>{
                        c_users.update({
                          email:email,
                        },{
                          '$set':{
                            password:doc.data.password
                          }
                        },(err5,updateResult)=>{
                           if(updateResult.result.nModified == 1){
                              return cb({ok:true,message:'verified OTP, password has been updated.'});
                           }else{
                              return cb({ok:false,message:'Error updating the password in db'});
                           }
                        });
                      });
                   }
                });
            })
          }else{
            return cb({ok:false,message:'Wrong Otp, Try again'});
          }
        }
      }else{// issue
        cb(false);
      }
    });
  },

  /** Feb 2017 */
  // Users to add to their profiles
  
  //Update : Vatsal : 2018-05-05 : From Br-master
  getUser: function (val) {
    return User1.findOne({
      "username": val.username,
      "password": val.password
    });
  },
  getOnlineUser: function (val) {
    return User1.find({
      "online": true
    });
  },
  checkLogin: function (val) {
    return User.find({
      "id": val,
      "online": true
    });
  },
  getClients: function (val) {
    console.log('val', val)
    // return Pet.query('SELECT pet._id FROM pet WHERE pet._id = $1', [ 'dog' ]{ "_id": val });
  }


};
