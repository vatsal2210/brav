/**
 * IndividualController
 *
 * @description :: Server-side logic for managing Individuals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getProfile : function (req,res) {
    userService.getUserInfo({email:req.authDecoded.email,type:4},function (ok, doc) {
      if(ok){res.json({ok:true,message:'have the data',data:doc})}
      else{res.json({ok:false,message:'No details found'})}
    })
  },
  
  /** v0.3 : Feb - 2017 */

  getMySessions:(req,res)=>{

  },
  scheduleSession:(req,res)=>{

  },
  respondToSessionPlan:(req,res)=>{
    /** choose to accept or reject a session planned */
  },

};

