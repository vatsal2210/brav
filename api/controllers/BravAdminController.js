/**
 * BravAdminController
 *
 * @description :: Server-side logic for managing bravadmins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *

 db.users.insert({name:'omkar dusane',type:1,email:'admin@brav.org',password:'123'});

 *
 */

module.exports = {
  /*
      sample:function (req, res) {
        console.log("sample run")
        res.send('yo')
      },
  */
  getAdminProfile: function (req, res) {
    console.log("Request for get brav one profile recieved");
    userService.getUserInfo({ email: req.authDecoded.email }, function (ok, doc) {
      if (ok) { res.json({ ok: true, message: 'have the data', data: doc }) }
      else { res.json({ ok: false, message: 'No details found' }) }
    })
  },
  /*
      getAllMediators : function (req, res) {
        mediatorService.all(function (ok,docs) {
          if(ok){
            res.json({ok:true,message:'all mediators in the list',data:docs});
          }else{
            res.json({ok:false,message:'server error'})
          }
        });
      },
  */
  getAllAdmins: function (req, res) { //to be done
    console.log("getAllAdmins Controller");
  },

  getAllOrgs: function (req, res) {
    console.log("getAllOrgs Controller");
    orgService.getAllOrgProfiles(function (ok, docs) {
      if (ok) {
        console.log("Orgs", docs)
        res.json({ ok: true, message: 'all orgs in the list', data: docs });
      }
      else {
        res.json({ ok: false, message: 'server error' })
      }
    });
  },

  getAllIndividuals: function (req, res) {
    console.log("getAllIndividuals Controller");
    individualService.getAllIndProfiles(function (ok, docs) {
      if (ok) {
        console.log("Individuals:", docs)
        res.json({ ok: true, message: 'all users in the list', data: docs });
      } else {
        res.json({ ok: false, message: 'server error' })
      }
    });
  },
  /*
      approveMediator : function (req, res) {
        console.log(req.body)
          mediatorService.approve({email:req.body.user_email,type:2},true,function (ok,docs) {
            if(ok){
              res.json({ok:true,message:'updated'});
            }else{
              res.json({ok:false,message:'server error'})
            }
          });
      },

      revokeMediator : function (req, res) {
        console.log(req.body)
        mediatorService.approve({email:req.body.user_email,type:2},false,function (ok,docs) {
            if(ok){
              res.json({ok:true,message:'updated'});
            }else{
              res.json({ok:false,message:'server error'})
            }
          });
      },
  */
  /** Mediators : BravOne / PRO */
  getAllMediators: (req, res) => {
    console.log("BravAdminController: getAllMediators ");
    mediatorService.getAllMediatorPublicProfiles(function (ok, docs) {
      if (ok) {
        res.json({ ok: true, message: 'here are all mediators, have fun', data: docs });
      }
      else {
        res.json({ ok: false, message: 'couldnt fetch mediators from db' });
      }
    });

  },

  medApproval: (req, res) => {
    console.log("Id, cstatus: ", req.body);  //eid and currentStatus: false
    let condition = {
      email: req.body.eid,
      "profile.approved": false,
    };
    let change = {
      "profile.approved": true,
      //"profile.proMediatorStatusRequested" : false
      //"profile.proMediatorStatusApproved" : false,
    };
    mediatorService.changeMediatorApproval(condition, change, function (err, id) {
      if (!err) {
        res.json({ ok: true, message: "Status changed" });
      }
      else {
        res.json({ ok: false, message: "Failed to change status" });
      }
    });

  },
  revokeApproval: (req, res) => {
    console.log("Id, cstatus: ", req.body);  //eid and currentStatus: true
    let condition = {
      email: req.body.eid,
      "profile.approved": true,
    };
    let change = {
      "profile.approved": false,
      //"profile.proMediatorStatusRequested" : false,
      "profile.proMediatorStatusApproved": false,
    };
    mediatorService.changeMediatorApproval(condition, change, function (err, id) {
      if (!err) {
        res.json({ ok: true, message: "Status changed" });
      }
      else {
        res.json({ ok: false, message: "Failed to change status" });
      }
    });

  },

  makeMediatorPro: (req, res) => {
    console.log(req.body);
    let condition = {
      email: req.body.eid,
      "profile.approved": true,
      "profile.proMediatorStatusRequested": true
      //"profile.proMediatorStatusApproved" : false
    };
    let change = {
      "profile.proMediatorStatusApproved": true
    };

    mediatorService.changeProStatus(condition, change, function (err) {
      if (!err) {
        res.json({ ok: true, message: " Changed status to Pro" });
      }
      else {
        res.json({ ok: false, message: "Error: Not Approved as BravOne" });
      }
    });
  },

  revokeMediatorPro: (req, res) => {
    console.log(req.body);
    let condition = {
      email: req.body.eid,
      //"profile.approved" :true,
      //"profile.proMediatorStatusRequested" : true,
      "profile.proMediatorStatusApproved": true
    };
    let change = {
      "profile.proMediatorStatusApproved": false
      // "profile.proMediatorStatusRequested" : false
    };

    mediatorService.changeProStatus(condition, change, function (err) {
      if (!err) {
        res.json({ ok: true, message: " Changed status to Pro" });
      }
      else {
        res.json({ ok: false, message: "Failed to change status" });
      }
    });

  },

  updateBankDetails: (req, res) => {
    /* req.body { mediatorId, banmkDetails{ } } */
  },

  makePayOut: (req, res) => {
    
  },

  /** Agreements **/
  getAllAgreementSnippets: (req, res) => {

  },
  addAgreementSnippet: (req, res) => {

  },
  modifyAgreementSnippet: (req, res) => {

  },
  removeAgreementSnippet: (req, res) => {

  },

  /** mediator orgs */
  getAllMediatorOrgs: (req, res) => {

  },
  approveMediatorOrg: (req, res) => {

  },
  revokeMediatrOrg: (req, res) => {

  },

  /*----- Boilerplate   ----*/
  createBoilerPlate: (req, res) => {

    let boilerDetails = { includedTags: [] };
    if (!!req.body.title) {
      boilerDetails.title = req.body.title.trim();

      if (boilerDetails.title.length < 1) {
        res.json({ ok: false, message: 'Invalid values for params : title or description' });
        return;
      }
    }
    else {
      res.json({ ok: false, message: 'Missing Title! Add Title!' });
      return;
    }
    if (!!req.body.includedTags) {
      //console.log("lets see type of req.body.includedTags :", typeof req.body.includedTags);
      boilerDetails.includedTags = req.body.includedTags;
    }
    else {
      res.json({ ok: false, message: 'Error! Add tags!' });
      return;
    }

    BoilerplateHelperService.createBoilerplate(boilerDetails, function (err, id) {
      if (err == 0) {
        res.json({ ok: true, id: id, message: 'Added Successfully' });
      }
      else if (err == 1) {
        res.json({ ok: false, message: 'Error' });
      }
      else if (err == 2) {
        res.json({ ok: false, message: 'Same title plate already exists!' });
      }

    });

  },

  saveBoilerPlate: function (req, res) {
    console.log("Inside BravAdminController-save Boiler plate");

    let update = {
      content: req.body.content,
      isFinal: false
    }
    console.log("Req.body", req.body, update);
    BoilerplateHelperService.saveBoilerplate(req.body.id, update, function (err) {
      if (err == 0) {
        res.json({ ok: true, message: 'Boilerplate content updated successfully' });
      }
      else if (err == 1) {
        res.json({ ok: false, message: 'No changes to made!' });
      }
      else {
        res.json({ ok: false, message: 'Error! Update Failed!' });
      }

    });
  },

  updateBoilerPlate: function (req, res) {  //title and tags update
    console.log("BravAdminController : update details");
    let update = {
      name: req.body.title,
      tags: req.body.includedTags
    }
    console.log("Req.body", req.body, update);
    BoilerplateHelperService.saveBoilerplate(req.body.id, update, function (err) {
      if (!err) {
        res.json({ ok: true, message: 'Updated successfully' });
      }
      else {
        res.json({ ok: false, message: 'Error: Failed to update' });
      }
    });
  },

  finalizeBoilerPlate: function (req, res) {
    console.log(req.body);
    BoilerplateHelperService.finalizeBoilerplate(req.body, function (err) {
      if (!err) {
        res.json({ ok: true, message: " Boilerplate Finalized!" });
      }
      else {
        res.json({ ok: false, message: "Failed to finalize!" });
      }
    });
  },

  getAllBoilerPlate: function (req, res) {
    console.log("Get all bp controller");
    BoilerplateHelperService.getAllBoilerPlate(function (ok, docs) {
      console.log("Bp :", docs);
      if (ok) {
        res.json({ ok: true, message: "All Boilerplates", data: docs });
      }
      else {
        res.json({ ok: false, message: "Error" });
      }
    });
  },

  getOneBoilerPlate: function (req, res) {
    console.log("Get one bp controller", req.query);
    let reqData = {
      name: 1,
      tags: 1,
      isFinal: 1,
      content: 1,
      _id: 1
    };
    let condition = {
      _id: uuidHelperService.makeObjectId(req.query.id)
    };
    BoilerplateHelperService.getBoilerplateData(reqData, condition, function (err, data) {
      if (!err) {
        console.log("Bp found:", data[0]);
        res.json({ ok: true, bp: data[0] });
      }
      else {
        res.json({ ok: false, message: "Error" });
      }
    });
  },

  deleteBoilerPlate: function (req, res) {
    console.log("BravAdmin: deleteBoilerPlate Ctrl", req.body);
    BoilerplateHelperService.removeBoilerPlate(req.body.id, function (err) {
      if (!err) {
        res.json({ ok: true, message: " Boilerplate Deleted" });
      }
      else {
        res.json({ ok: false, message: "Error" });
      }
    });

  },

  /*---- Snippets  -----*/
  createSnippet: function (req, res) {
    //console.log(req.body);
    let text = req.body.content;
    let tag = req.body.tag;
    SnippetHelperService.createSnippet(text, tag, function (err, id) {
      if (err == 0) {
        res.json({ ok: true, id: id });
      }
      else if (err = 2) {
        res.json({ ok: false, message: "Same snippet exists!" });
      }
      else {
        res.json({ ok: false, message: "Failed to save!" });
      }
    });

  }


}


