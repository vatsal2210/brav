/**
 * OrgController
 *
 * @description :: Server-side logic for managing orgs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  createChatSession : function (req, res) { // in users , date , timeslot
    var orgid = req.authDecoded.email ;
    var otype = req.authDecoded.type ;
    var orgname = "orgnamevar" ;

    userService.getName(req.authDecoded.email,function(err,name){
      if(!err){ //name found
        //res.json({ok:true,message:'name', name: name});
        console.log("name: "+name.name);
        orgname = name.name;
        //console.log("mname"+mname);
        //console.log("mname.name"+mname.name);
        if(!!req.body.dateslot && !!req.body.timeslot && !!req.body.usersarray && !!req.body.title && !!req.body.note && !!req.body.tz && !!orgname){
          var usersList = [];
          req.body.usersarray.forEach(function (item) {
            usersList.push({email:item,willJoin:false, hasDenied:false,hasJoined:false,hasLeft:false})
          });

          ChatSessionService.createSession(req.body.title,req.body.note,orgid,orgname,otype,usersList,req.body.dateslot,req.body.timeslot,req.body.tz,function (ok) {
            if(ok){
              res.json({ok:true,message:'created session',data:''})
            }else{
              res.json({ok:false,message:'database error'})
            }
          });
        }
        else{
          res.json({ok:false,message:'missing parameters'})
        }
      }
      else{

        res.json({ok:false,message:'DB error'});

      }
    });


  },

  getAllChatSessions : function(req,res){
    // give all sessions planned by this Org
    var orgid = req.authDecoded.email ;
    ChatSessionService.getAllByOrg(orgid,function (ok, docs) {
      if(ok){
        res.json({ok:true,message:'all sessions in data',data:docs});
      }else{
        res.json({ok:false,message:'some issue with db'})
      }
    });

  },

  /** v0.3 , Feb 2017 */
  

};

