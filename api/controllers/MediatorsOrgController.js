/**
 * MediatorsOrgController
 *
 * @description :: Server-side logic for managing Mediatorsorgs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getOneCompProile:(req, res)=>{
        //console.log("getMediationCompanyProfile", req.query);
        console.log("authdecoded: ",req.authDecoded.email);
        let name = req.query.name;
        let user = req.authDecoded.email;
        mediationCompanyHelperService.getOrgProfile(name, function(ok,doc){
            if(ok){
                console.log("Company profile:", doc);
                if(user == doc.creator.email){  
                    doc.creator.flag= true; //if user is creator 
                }
                else{
                    doc.creator.flag= false;
                }

                res.json({ok: true, data: doc});
            }
            else{
                res.json({ok: false, message:"Error!!!"});
            }
        });

    },

    getMediationCompanyList:(req, res)=>{
        console.log("getMediationCompanyList: ",req.authDecoded.email);
        let eid = req.authDecoded.email;
        mediationCompanyHelperService.getPendingMediationCompany(eid, function(ok,pdoc){
            if(ok){
                console.log("Pending Company:", pdoc);
                mediationCompanyHelperService.getMyMediationCompany(eid, function(ok,mydoc){
                    if(ok){
                        console.log("My Company:", mydoc);
                        res.json({ok: true, pending: pdoc, myCom : mydoc});
                    }
                    else{
                        res.json({ok: false, message:"Error!!!"});
                    }
                });
            }
            else{
                res.json({ok: false, message:"Error!!!"});
            }
        });

    },


	getPublicProfileByName:(req,res)=>{

    },
    getProfileByName:(req,res)=>{

    },
    getAllMembers:(req,res)=>{

    },
    inviteToOrg:(req,res)=>{ // mediatorId,orgId,invitorAuth

    },
    removeFromOrg:(req,res)=>{ // mediatorId,orgId

    },
    leaveOrg:(req,res)=>{ // mediatorId,orgId

    },
};

