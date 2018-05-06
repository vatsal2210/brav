module.exports = {

  getAllPlans : function (req, res) {

  },
  getMyPlans : function (req, res) {

  },
  initiatePlanTransaction : function (req, res) {

  },


  getplans: function(req, res){
    console.log("plan controller/getplans");
    console.log("Req.token for getplans", req.authDecoded.type, req.body); //type of user
    planService.getAllPlans(req.authDecoded.type,function(err,plan){
      if(!err){ //plans found
        res.json({ok:true,message:'Plans', data: plan});
      }
      else{
        if(plan==null){ //no plans found
          res.json({ok:false,message:'No plan'});
        }
        else{ //errors
          res.json({ok:false,message:'Error'});
        }
      }
    });
  },

  addplan :function(req,res){
    console.log("plan controller/addplan");
    console.log("Req.body",req.body);

    var obj ={};
    obj.pname = req.body.plan[0];
    obj.desc = req.body.plan[1] ;
    obj.pcost = req.body.plan[2];
    obj.mediator = req.body.plan[3];
    obj.org = req.body.plan[4];
    obj.validity = req.body.plan[5];
    obj.credits = req.body.plan[6];


    //validation
    if(obj.pname == ""){
      //console.log("Invalid name");
      res.json({ok:false,message:'Plan name is invalid'});
    }
    else{
      //console.log("Valid name");

      if(obj.desc.length <0 || obj.desc.length >100 ){
        //console.log("InValid desc");
        res.json({ok:false,message:'Plan desc is invalid'});
      }
      else{
        //console.log("Valid desc");

        if(obj.pcost == "" || isNaN(obj.pcost)){
          //console.log("Invalid cost");
          res.json({ok:false,message:'Plan cost is invalid'});
        }

        else{
          //console.log("Valid cost");

          if(obj.validity == "" || isNaN(obj.validity)) {
            //Invalid days
            res.json({ok:false,message:'Plan validity is invalid'});
          }
          else{
            if(obj.credits == "" || isNaN(obj.credits)){ //invalid credits
              res.json({ok:false,message:'Plan credits is invalid'});
            }

            else{
              //pname, cost, desc valid , insert into db
              planService.addplan(obj,function(err){
                if(!err){
                  res.json({ok:true,message:'Plan Added Successfully'});
                }
                else{
                  res.json({ok:false,message:'Plan Already Existing'});
                }
              });
            }
          }
        }
      }

    }
  },

  editplan :function(req,res){
    console.log("plan controller/editplan");
    //console.log(" edit plan Req.body",req.authDecoded.body);
    //console.log(" edit plan Req.email "+req.authDecoded.email);

    var val ={};
    val.id = req.body.change[0];
    val.pname = req.body.change[1] ;
    val.pcost = req.body.change[2];
    val.desc = req.body.change[3];
    val.active = req.body.change[4];
    val.mediator= req.body.change[5];
    val.org = req.body.change[6];
    val.validity = req.body.change[7];
    val.sessions = req.body.change[8];

    console.log('the values to be editted are',val);

    //validation
    if(val.desc.length <1 || val.desc.length >100){
      res.json({ok:false,message:'Invalid Description'});
    }
    else{

      //Edited values valid , insert into db
      planService.editPlan(val, function(err){
        if(!err){
          res.json({ok:true,message:'Plan Updated Successfully'});
        }
        else{
          res.json({ok:false,message:'Error'});
        }
      });
    }

  },

  buyplan :function(req,res){
    console.log("Inside buyplan controller" );
    //console.log(req.headers['x-access-token']);
    console.log(req.body.planDetails, req.authDecoded);
    planCost = req.body.planDetails[0];
    planId = req.body.planDetails[1];
    userId = req.authDecoded.email;
    planService.getPlanDetails(planId, function(err, plan){
      if(err){
        res.json({ok:false,message:'Error'});
      }
      else{
        console.log("ONE PLAN",planId, plan);

        if( planCost != plan.cost){ //plan cost changed
          console.log("Plan cost does match");
          res.json({ok:false,message:'Error'});
        }

        else{

          TransactionHelperService.createTxn(userId, plan, function(err, tid){
            console.log("Created txn");
            if(err)	{
              res.json({ok:false,message:'Error'});
            }
            else{
              res.json({ok:true,message:'Txn created', data: tid});
            }
          });
        }
      }
    });

  },

  stripeCharge:function(req,res){
    console.log("inside planController/stripeCharge");
    console.log("inside planController/stripeCharge/planId: ",req.body.planId);
    console.log("inside planController/stripeCharge/stripeToken: ",req.body.stipeToken);
    var token=req.body.stipeToken;
    amt=req.body.pcost;
    console.log("inside planController/stripeCharge/cost: ",amt);
    /*	planService.getPlanDetails(req.body.planId, function(err, plan){
     if(err){
     res.json({ok:false,message:'Error'});
     }
     else{
     console.log("ONE PLAN",req.body.planId, plan);

     if(req.body.planId!= plan.cost){ //plan cost changed
     console.log("Plan cost does match");
     res.json({ok:false,message:'Error'});
     }

     else{

     TransactionHelperService.createTxn(userId, plan, function(err, tid){ //changes to userID
     console.log("Created txn");
     if(err)	{
     res.json({ok:false,message:'Error'});
     }
     else{
     res.json({ok:true,message:'Txn created', data: tid});
     }
     });
     }
     }
     });*/
    var stripe = require("stripe")("sk_test_yzsqa3U3l8SqqqnVYeswxIeC");
    var charge = stripe.charges.create({
      amount: amt, //amt
      currency: "usd",
      description: "Example charge",
      source: token,
    }, function(err, charge) {
      // asynchronously called
      if (err) {
        console.log("error", err.message);
        // return res.redirect('/#/m/buyplans');
      }
      else
        console.log("Payment Successful!");
    });
  },
  /*
   deleteplan: function(req, res){
   console.log("plan controller/deleteplans");
   console.log("Req.body", req.body ); 
   var planid = req.body.planid;

   planService.deletePlan(planid, function(err){
   console.log("Deleted and back");
   if(err){
   res.json({ok:false,message:'Eror'});
   }
   else{
   res.json({ok:true,message:'Plan Deleted'});
   }
   });

   }
   */
};
