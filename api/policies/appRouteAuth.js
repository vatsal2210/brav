const express = require('express');
let debug = false ;
const log = (m)=>{
  if(debug){
    console.log(m);
  }
}
const tokenResetter = (res)=>{
    //res.json({ok:false,message:'error authenticating'})
    res.redirect('#reset')
    return;
};
const redirectWithoutreset = (res)=>{
    //res.json({ok:false,message:'error authenticating'})
    res.redirect('/')
    return;
};
module.exports = function appRouteAuth(req,res,next) {
  log('appRouteAuth : Request recieved , Hasbody = '+!!req.body);
  log(req.body);
  if(req.body){
    if(req.body.auth){
      var token = req.body.auth ;
      log(typeof req.body.auth);
      if((typeof token) != 'string')
      {
          log('appRouteAuth : redirecting 1')
          tokenResetter(res);
          return;
      }
      AuthJwtService.decode(token,(rslt)=>{
        if(rslt.ok)
        {
          req.authDecoded = rslt.decoded;
          log('verified and decoded')
          next();
          return;
        }
        else{
          log('appRouteAuth : redirecting 2')
          tokenResetter(res);
          return;
        }
      });
    }else{
      log('appRouteAuth : redirecting 3')
      redirectWithoutreset(res);
      //return res.json({ ok: false, message: 'Failed to authenticate you' });
    }
  }else{
      log('appRouteAuth : redirecting 4')
      redirectWithoutreset(res);
      //return res.json({ ok: false, message: 'Failed to authenticate you' });
  }
}

