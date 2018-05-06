/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  sampleSocket:(req,res)=>{
    console.log("sampleSocket said something");
    res.send('ok tried')
   },

   sample:(req,res)=>{
    console.log("sample said something");
    console.log(req.body);
    res.send('ok tried')
   },

  signUp: function(req,res){
    console.log("POST /signup");
    console.log(req.body);
    // console.log(req.headers);
    // email, password , name
    if(req.body.hasOwnProperty('email')&&req.body.hasOwnProperty('pw')&&req.body.hasOwnProperty('name')){
      var obj ={};
      obj.email = req.body.email;
      obj.password = req.body.pw ;
      obj.name = req.body.name;
      obj.type = 'fraud' ;
      var typeString = req.body.type;
      switch(typeString){
        case 'Organization':{
          obj.type = 3 ;
          break;
        }
        case 'Brav One':{
          obj.type = 2 ;
          obj.profile={
            proMediatorStatusRequested:false,
            approved:false
          }
          break;
        }
        case 'Individual':{
          obj.type = 4;
          break;
        }
        case 'Professional Mediator':{
          obj.type = 2;
          obj.profile={
            proMediatorStatusRequested:true,
            proMediatorStatusApproved:false,
            approved:false
          }
          break;
        }
      }
      if(obj.type == 'fraud'){
        res.json({ok:false,message:'user type not valid'})
        return;
      }

      obj.agree = req.body.agree;
      obj.verified = false ;
      userService.adduser(obj,function(anyError,reason){
        if(!anyError){
          res.json({ok:true,message:'sent otp'});
        }else{
          res.json({ok:false,message:'Cannot Register this email.',reason:reason})
        }
      });
    }
    else{
      res.status(400);
      res.json({ok:false,message:'missing params'})
    }
  },

  signIn : function (req,res) {
    console.log("POST /signin");

    if(req.body.hasOwnProperty('email')&&req.body.hasOwnProperty('pw')){
      var obj = {email:req.body.email,password:req.body.pw};
      userService.signIn(obj,function(err,token,type){
        if(!err){
          res.json({ok:true,token:token,email:obj.email,type:type,message:'success'});
        }else{
          res.json({ok:false,message:'no match for these credentials'})
        }
      });
    }else{
      res.status(400);
      res.json({ok:false,message:'missing params'})
    }
  },

  verifyOTP : function (req,res) {
    console.log("POST /verify");

    //email, otp
    if (req.body.hasOwnProperty('email') && req.body.hasOwnProperty('otp')) {
      var obj = {email: req.body.email, otp: req.body.otp};
      userService.verifyOtp(obj, function (err) {
        if (!err) {
          res.json({ok: true,message:'verified OTP'});
        } else {
          res.json({ok: false, message: 'verification failed'})
        }
      });
    } else {
      res.status(400);
      res.json({ok: false, message: 'missing params'})
    }
  },

  signOut : function (req, res) {
    console.log("logout request came");
    res.json({ok:true,message:'bye bye'});
    // Pre Expire the JWT here : need lookup
  },

  forgotPassword:(req,res)=>{
    console.log("POST /forgot password");
    console.log(req.body);
    if(req.body.email&&req.body.pw){
      var obj ={};
      obj.email = req.body.email;
      obj.password = req.body.pw ;
      obj.verified = false ;
      userService.forgotPassword(obj,okObj=>{
          res.json(okObj);
      });
    }
    else{
      res.status(400);
      res.json({ok:false,message:'missing params'})
    }
  },

  verifyAfterPasswordRecovery:(req,res)=>{
    console.log("POST /verify forgot password");
    console.log(req.body);
    if(req.body.email&&req.body.otp){
      userService.verifyAfterPasswordRecovery(req.body.email,req.body.otp,okObj=>{
          res.json(okObj);
      });
    }
    else{
      res.status(400);
      res.json({ok:false,message:'missing params'})
    }
  },

  //Update : Vatsal : 2018-05-05 : From Br-master functions
  logout: function (req, res) {
    if (req.body.id) {
      User1.update({
        id: req.body.id
      }, {
        online: false
      }, function (errUpdate, resUpdate) {
        if (errUpdate) return res.serverError({
          'success': false,
          'msg': 'Something went wrong!!! Try again later'
        });
        if (!resUpdate) return res.ok({
          'success': false,
          'msg': 'You can not be not online now'
        });
        req.session.userId = '';
        req.session.loggedin = false;
        return res.ok({
          'success': true,
          'msg': 'Logout successfull'
        });
      });
    }
  },
  login: function (req, res) {
    if (req.body.username && req.body.password) {
      UserService
        .getUser(req.body)
        .exec(function (err, ress) {
          if (err) return res.serverError({
            'success': false,
            'msg': 'Something went wrong!!! Try again later'
          });
          if (!ress) return res.ok({
            'success': false,
            'msg': 'Invalid username or password'
          });
          // if (ress.online)
          //   return res.ok({
          //     'success': false,
          //     'msg': 'You are already online in some browser'
          //   });
          User1.update(ress, {
            online: true
          }, function (errUpdate, resUpdate) {
            if (errUpdate) return res.serverError({
              'success': false,
              'msg': 'Something went wrong!!! Try again later'
            });
            if (!resUpdate) return res.ok({
              'success': false,
              'msg': 'You can not be not online now'
            });
            req.session.userId = ress.id;
            req.session.loggedin = true;
            return res.ok({
              'success': true,
              'msg': 'Login successfull',
              data: ress
            });
          });
        });
    } else {
      return res.ok({
        "success": false,
        "msg": "Please provide valid password and user name"
      });
    }

  },
  registerpage: function (req, res) {
    res.view();
  },
  profilepage: function (req, res) {

    if (req.session.userId && req.session.loggedin) {
      UserService
        .checkLogin(req.session.userId)
        .exec(function (err, ress) {
          if (err) {
            ress.redirect('/');
          } else if (!ress) {
            ress.redirect('/');
          } else {
            res.view();
          }
        });
    } else {
      res.redirect('/');
    }
  },
  loginpage: function (req, res) {
    res.view();
  },
  register: function (req, res) {
    if (req.body.firstname && req.body.username && req.body.password) {
      User1.create(req.body, function (err, createdUser) {
        if (err) {
          if (err.invalidAttributes && err.invalidAttributes.hasOwnProperty("username") || err === 'E_VALIDATION') {
            let errMsg = err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] ? err.invalidAttributes.username[0].message : 'User name already exist'
            return res.ok({
              'success': false,
              'msg': errMsg
            })
          }


          if (err === 'E_VALIDATION' && err.attributes[0] == 'username') {
            return res.ok({
              'success': false,
              'msg': 'User name already exist'
            })
          }
          return res.serverError({
            'success': false,
            'msg': 'Something went wrong!!! Try again later'
          });
        }
        if (!createdUser) return res.ok({
          'success': false,
          'msg': 'Invalid username or password'
        });
        return res.ok({
          'success': true,
          'msg': 'Register successfull',
          data: createdUser
        });
      });
    } else {
      return res.ok({
        'success': false,
        'msg': 'Enter all manditory field'
      });
    }
  },
  online: function (req, res) {
    UserService
      .getOnlineUser()
      .exec(function (err, onlineUser) {
        if (err) return res.serverError({
          'success': false,
          'msg': 'Something went wrong!!! Try again later'
        });
        if (onlineUser.length == 0) return res.ok({
          'success': false,
          'msg': 'No online users found'
        });
        return res.ok({
          'success': true,
          'msg': 'Found online user',
          data: onlineUser
        });
      })
  },
  getById: function (req, res) {
    if (req.session.userId && req.session.loggedin) {

    } else {
      res.redirect('/')
    }
  }
};

