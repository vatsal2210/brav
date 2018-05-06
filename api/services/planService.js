/**
 * Created by Omkar Dusane on 07-Oct-16.
 */
module.exports = {

  /*addplan: function (obj) {
   Plans.create(obj).exec();
   },
   deactivatePlan:function(planId){
   Plans.update({planid:planId,active:false});
   },

   getAllPlans:function (res) {
   Plans.find().exec(function (err,arr)
   {
   if (err == null) {
   res.json({ok:true,data:arr});
   }
   })
   },*/

  addplan: function (obj, callback) {
    console.log("Inside planService", obj);
    Plans.findOne({ planName: obj.pname }).exec(function (err, plans) {
      if (err) {
        return callback(true);
      }
      else if (!plans) { //no same planName
        Plans.native(function (err2, Collection) { //add plans
          Collection.update({ planName: obj.planName },
            { "$set": { planName: obj.pname, description: obj.desc, cost: Number(obj.pcost), active: true, mediator: obj.mediator == "true", org: obj.org == "true", validity: Number(obj.validity), sessions: Number(obj.credits) } },
            { "upsert": true },
            function (err3, updated) {
              if (err3) return callback(true);  //error
              else {
                //console.log(err3, err2, updated);
                callback(false);
              }
            }
          );
        });

      }
      else { //same planName exists
        callback(true);
      }
    });
  },

  getAllPlans: function (type, callback) {
    if (type == '1') {  //ceo
      Plans.find().exec(function (err, plan) {
        if (err == null) { //no error
          if (plan.length == 0) { //no plans
            callback(true, null); //error = true
          }
          else { // plans found
            callback(false, plan);
          }
        }
      })
    }
    else if (type == '2') { // mediator
      Plans.find({ mediator: true, active: true }).exec(function (err, plan) {
        if (err == null) { //no error
          if (plan.length == 0) { //no plans
            callback(true, null); //error = true
          }
          else { // plans found
            callback(false, plan);
          }
        }
      })
    }
    else if (type == '3') { //org
      Plans.find({ org: true, active: true }).exec(function (err, plan) {
        if (err == null) { //no error
          if (plan.length == 0) { //no plans
            callback(true, null); //error = true
          }
          else { // plans found
            callback(false, plan);
          }
        }
      })
    }

  },

  getPlanDetails: function (pid, callback) {
    console.log(pid);
    Plans.findOne({ id: pid }).exec(function (err, plan) {
      if (err == null) { //no error
        if (!plan) { //no plan found
          callback(true, null); //error = true
        }
        else { // plans found
          callback(false, plan);
        }
      }
    })
  },

  deletePlan: function (plan, callback) {
    //find plan to be deleted
    Plans.find(plan).exec(function (err, found) {
      if (err) return callback(true);
      if (found.length == 0) callback(true);  //not found

      //no error, plan found
      Plans.destroy(plan, function (err) {
        if (err) return callback(true);
        callback(false);// no err, hence deleted
      });
    })
  },

  editPlan: function (obj, callback) {
    console.log("editplan planService");
    Plans.find({ id: obj.id }).exec(function (err, plan) {
      if (err) {
        callback(true); //some error 
      }
      else if (plan.length == 0) {
        callback(true); //no plan found
      }
      else {  //match found
        console.log("found val:", plan, plan.length);

        Plans.update({ id: obj.id },
          { planName: obj.pname, description: obj.desc, cost: Number(obj.pcost), active: obj.active === "true", mediator: obj.mediator === "true", org: obj.org === "true", validity: Number(obj.validity), sessions: Number(obj.sessions) }).exec(function (err2, updated) {
            if (err2) { return callback(err2); }
            console.log(updated, obj.id, err2);
            callback(false);
          });

        /* Plans.native(function (err2, Collection) { //update values
         Collection.update({id :obj.id }, {"$set": {cost: Number(obj.pcost) }},
         function (err3, updated){
         if(err3){ return callback(true);}
         callback(false);
         })
         })
         */
      }
    });
  }



};
