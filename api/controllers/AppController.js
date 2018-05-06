/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  appHome : function (req, res) {
    switch(req.authDecoded.type){
      case 1 :{
        res.json({ok:true,message:'success',data:{headline:'You are Super Admin of Brāv',
          article:['Here you will be able to : ' ,
            '1. manage mediators' ,
            '2. manage Individual users' ,
            '3. Manage organizations' ,
            '4. Manage Costs of sessions' ,
            '5. manage weivers' ]
        }});
        break;
      }
      case 2 :{
        res.json({ok:true,message:'success',data:{headline:'You are a Brāv Conflict Manager.',
          article:[
          ' You can: ' ,
          '1. Use the platform to manage conflicts with your clients' ,
          '2. Meet new clients' ,
          '3. Create and preserve Agreements.' ,
          '(note: Please complete youe Profile to get Listed as a mediator.)'
        ]
        }});

        break;
      }
      case 3 :{
        res.json({ok:true,message:'success',data:{headline:'You are Admin of an Organization registered at Brāv',
          article:['You can: ' ,
          '1. Find Conflict managers.' ,
          '2. Manage your legal matters with adding cases and creating sessions with conflict managers.' ,
          '3. Create, Sign and Preserve Agreements for your Organization' ]
          }});
        break;
      }
      case 4 :{
        res.json({ok:true,message:'success',data:{headline:'You are an individual who is using Brāv for conflict management',
          article:['Here, you will be able to : ' ,
          '1. Find Conflict managers.' ,
          '2. Resolve your conflict online by creating Brāv sessions.' ,
          '3. Create and preserve Agreements.' ,]
           }});
        break;
      }
      default:{
        res.status(403);
        res.json({ok:false,message:'unauthorized'});
      }
    }
  },
  applicationGet:(req,res)=>{
    res.redirect('/');
  },
  application : (req,res)=>{
    //console.log('/application req here',req.authDecoded)
    //console.log('AppController with '+req.authDecoded.type);
    if(4 >= req.authDecoded.type  && req.authDecoded.type >= 1  ){
      let data ={};
      let title = 'Brāv';
      switch( req.authDecoded.type){
        case 1:{
          data.module = 'pages/BravAdmin/bravAdmin.module.js';
          data.ctrls = 'pages/BravAdmin/bravAdmin.controllers.js';
          title+=" Admin";
          break;
        }
        case 2:{
          data.module = 'pages/BravOnes/bravOnes.module.js';
          data.ctrls = 'pages/BravOnes/bravOnes.controllers.js';
          title+=" for Conflict Managers";
          break;
        }
        case 3:{
          data.module = 'pages/org/org.module.js';
          data.ctrls = 'pages/org/org.controllers.js';
          title+=" for Organizations";
          break;
        }
        case 4 :{
          data.module = 'pages/i/i.module.js';
          data.ctrls = 'pages/i/i.controllers.js';
          title+=".org for People";
          break;
        }
      }
      //console.log('rendering type '+JSON.stringify(data));
      res.view('application',{ data: data,title: title });    
    
    // }else if(req.authDecoded.type == 4 ){
    //   res.view('application4',{ data: {type:4}, title: 'Welcome to Brav for Individuals' });    
    
    // }else if(req.authDecoded.type == 3 ){
    //   res.view('application3',{ data: {type:3}, title: 'Welcome to Brav for Organizations' });    
    
    // }else if(req.authDecoded.type == 1 ){
    //   res.view('application1',{ data: {type:1}, title: 'Welcome to Brav Admin' });    

    }else{
      console.log('throwing back to #/reset')
      res.redirect('#/reset');
    }

  },

};

