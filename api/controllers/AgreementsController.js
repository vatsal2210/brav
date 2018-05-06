/**
 * AgreementsController
 *
 * @description :: Server-side logic for managing Agreements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    // new agreement create possible
    create: (req,res)=>{
      //res.json({ok:true,id:'77868768'}); return ;
      /** Params to send in API :
      *  title , description
      *  involvedParties:['email@mail.com','someone@one.com',...]
      */
      let agreementDetails ={involvedParties:[]};
      if(!!req.body.title &&!!req.body.description){
        agreementDetails.title=req.body.title.trim() ;
        agreementDetails.content='Empty agreement' ;
        agreementDetails.description=req.body.description.trim() ; 
        if(agreementDetails.title.length <1 && agreementDetails.description.length <1)
        {
             res.json({ok:false,message:'Invalid values for params : title or description'});
             return;       
        }
      }else{
         res.json({ok:false,message:'Missing params : title or description'});
         return;
      };
      if(!!req.body.involvedParties){
         agreementDetails.involvedParties = req.body.involvedParties;
      }else{
          res.json({ok:false,message:'Missing params : involvedParties'});
          return;
      }
      agreementDetails.involvedParties.push(req.authDecoded.email);
      let filtered = [];
      agreementDetails.involvedParties.forEach(involvedOne=>{
        if(filtered.indexOf(involvedOne) <0){
            filtered.push(involvedOne);
        }
      });
      agreementDetails.creator ={
            email:req.authDecoded.email,
            type:req.authDecoded.type  
        };
      AgreementHelperService.createAgreement(agreementDetails,
        resObject=>res.json(resObject)
      );
    },
    
    update:(req,res)=>{
        /** id => descr title fields are updatable */
        if(!req.body.id){
          res.json({ok:false,message:'Missing params : id'});
          return;
        }
        if(req.body.discard){
          AgreementHelperService.discard(req.body.id,
            { 
              // creator
              email:req.authDecoded.email,
              type:req.authDecoded.type
            }
            ,(resObject)=>{res.json(resObject);return;
          });
        }else{
          let updates ={};
          if(!!req.body.title){
            updates.title= req.body.title ;
          }
          if(!!req.body.description){
            updates.description= req.body.description ;
          }
          if(!!req.body.checklist){
            updates.checklist= req.body.checklist ;
          }
          if(!!req.body.content){
            updates.content= req.body.content ;
          }
          if(!!req.body.involvedParties){
            updates.involvedParties= req.body.involvedParties ;
            if(updates.involvedParties.indexOf(req.authDecoded.email)<0)
            updates.involvedParties.push(req.authDecoded.email);
          }
          AgreementHelperService.updateAgreement(
           req.body.id,
           { // creator
              email:req.authDecoded.email,
              type:req.authDecoded.type
           },
           updates,
           (resObject)=>{res.json(resObject);}
          ); 
        };
    },

    saveContent:(req,res)=>{
        /** id=> content , checklist , */
        if(!req.body.id || !req.body.content ){
          res.json({ok:false,message:'Missing params,:all these are needed: id content and checklist'});
          return;
        }
        let updates= {
            content : req.body.content ,
            checklist : req.body.checklist||[],
        };
        AgreementHelperService.updateAgreement(req.body.id,
        {
            email:req.authDecoded.email,
            type:req.authDecoded.type
        },
        updates,resObject=>res.json(resObject));
    },

    getLastSavedContent:(req,res)=>{
        if(!req.query || !req.query.id){
          res.json({ok:false,message:'Missing params: id'});
          return;
        }else{
            let id = req.query.id;
            AgreementHelperService.getAgreementContent(id,req.authDecoded.email,
            resObject=>res.json(resObject));
        }
        console.log("WTF!")
    },

    finalize:(req,res)=>{
        // map aray of involvedParties into an object array and also send emails to invite sign
        if(!req.body.id){
          res.json({ok:false,message:'Missing params,:all these are needed: id content and checklist'});
          return;
        } 
        let id = req.body.id ;
        AgreementHelperService.finalize(id,{
            email:req.authDecoded.email,
            type:req.authDecoded.type
        },
        resObject=>res.json(resObject));
    },

    getAllDraftAgreements :(req,res)=>{ 
        /** 
         * Show all agreements which this person created and not finalized
         * isFinal : false
         * isCreator : true
         * isAccepted : doesnt matter
        */
        AgreementHelperService.getAgreements(
        {
            yes:false
        },    
        {
            isFinal:0,
            isCreator:1, // matters
            isSigned:2 // doesnt matter
        },req.authDecoded.email,
        resObject=>res.json(resObject));
    },

    getAllSharedDraftAgreements :(req,res)=>{ 
        /** 
         * Show all agreements which this person created and not finalized
         * isFinal : false
         * isCreator : false
         * isSigned : false and doesnt matter
        */
        AgreementHelperService.getAgreements(
        {
            yes:false
        },    
        {
            isFinal:0, // matters
            isCreator:0, // matters
            isSigned:2 // doesnt matter
        },req.authDecoded.email,
        resObject=>res.json(resObject));
    },

    getAllAgreementSigningRequests :(req,res)=>{
        /**
         * isSigned : false
         * isFinal : true
         * isCreator : false
         */
        AgreementHelperService.getAgreements(
        {
            yes:false
        },      
        {
            isFinal:1,
            isCreator:0, // matters
            isSigned:0 //  matters
        },req.authDecoded.email,
        resObject=>res.json(resObject));
    },

    getAllSignedAgreements :(req,res)=>{
        /**
         * isSigned : true
         * isFinal : true
         * isCreator : true/ false
         */
        AgreementHelperService.getAgreements(
        {
            yes:false
        },  
        {
            isFinal:1,
            isCreator:2, // doesnt matter
            isSigned:1 // matters
        },req.authDecoded.email,
        resObject=>res.json(resObject));
    },
    
    getOneAgreement:(req,res)=>{
        console.log('in getOne agreement ',req.query)
        /** params: id , accessType
         *  1 = draft : EDIT non-final // {readOnly :false, isCreator:true, editable:true }
         *  2 = shared Draft : VIEW non-final // stream to non creator whle editing
         *  3 = signingrequest VIEW final //creator or non creator can view
         *  4 = signed VIEW final //{}
          */
        let cast = {} ;
        if(!req.query.id){
          res.json({ok:false,message:'Missing params: id'});
          return;
        }; 
        if(!req.query.accessType){
          res.json({ok:false,message:'Missing params: accessType'});
          return;
        }; 
        if(req.query.accessType <5 && req.query.accessType >0){
            if(req.query.accessType == 1){
                cast={
                    isSigned:2,
                    isCreator:1,
                    isFinal:0
                }
            }else if(req.query.accessType == 2){
                cast={
                    isSigned:2,
                    isCreator:0,
                    isFinal:0
                }
            }else if(req.query.accessType == 3){
                cast={
                    isSigned:0,
                    isCreator:2,
                    isFinal:1
                }
            }else if(req.query.accessType == 4){
                cast={
                    isSigned:1,
                    isCreator:2,
                    isFinal:1
                }
            }
        }else{
            res.json({ok:false,message:'invalid value of params: type'});
            return;
        }
        AgreementHelperService.getAgreements(
        {
            yes:true,
            id:req.query.id
        },  
        cast,req.authDecoded.email,
        resObject=>res.json(resObject));
    },
    
    sign:(req,res)=>{
        /** id and accept needed */
        if(!req.body.id || !req.body.accept ){
          res.json({ok:false,message:'Missing params: id or accept '});
          return;
        };
        AgreementHelperService.sign(
            req.authDecoded.email,
            req.body.accept,
            req.body.id,
        resObject=>res.json(resObject));
    },
    
    generatePdf:(req,res)=>{
        res.json({ok:true,pdflink:'http://www.ucasm.org/wp-content/uploads/2015/07/dummy_pdf.pdf'});return;
    },
    
    getHelperData:(req,res)=>{
      let reqData = {
        _id : 1,
        name: 1
      };
      let condition = {
        isFinal : true
      };

      BoilerplateHelperService.getBoilerplateData( reqData, condition, function(err, data){
          if(data.length ==0){
              data.push({_id:101,tags:['family','divorce'],name:'General Agreement Boilerplate'});
          }
        if(!err){
          const help = {
            ok: true,
            boilerplates : data ,
            // boilerplates:[
            //       {_id:101,tags:['family','divorce'],name:'General Agreement Boilerplate'},
            //       {_id:102,tags:['Parental Custody'],name:'Parental Custody Agreement Boilerplate'},
            //       {_id:103,tags:['Interpersonal Agreement'],name:'Interpersonal Agreement Boilerplate'},
            //   ],
            checklist : [
                'All parties intend to be bound are mentioned.',
             //   'Any and all parties necessary for agreement to be binding have signed, acknowledge and understand agreement.',
                'Mentions a valid date, clear full, legal names of any and all parties involved`',
                'Terms of the agreement are definite and certain',
                'Mentioned the jurisdiction you wish to follow',
             //   'Is signed fully within a month of creating.',
             //   'Parties signed are at least 18 unless providing legal guardin\'s sign as well.'
            ],
            snippets:[
                {id:101,tags:['names of parties'],text:`Please type the names of any and all parties necessary for this Agreement to occur. This agreement shall be binding upon the parties, their successors, assigns and personal representatives. Time is of the essence on all undertakings. This agreement shall be enforced under the laws of the State of ___________________________. This is the entire agreement.`},
        
                {id:102,tags:['Choice of Law and Forum Clause'],text:`This agreement shall be interpreted under the laws of the State of __________. Any litigation under this agreement shall be resolved in the trial courts of __________ County, State of _______________.`},
                
                {id:103,tags:['Brāv Clause'],text:`All disputes, controversies, or claims arising out of or relating to this contract shall be submitted binding arbitration in accordance with the applicable rules of Brāv then in effect.`},

                {id:104,tags:['Savings (Severability) Clause'],text:`If any provision of this Contract is held unenforceable, then such provision will be modified to reflect the parties' intention. All remaining provisions of this Contract shall remain in full force and effect.`},

                {id:105,tags:['Witness Clause'],text:`This agreement shall be binding upon the parties, their successors, assigns and personal representatives. Time is of the essence on all undertakings. This agreement shall be enforced under the laws of the State of ___________________________ This is the entire agreement.`},

                {id:106,tags:['Statute of Limitations Clause'],text:`The parties agree that any action in relation to an alleged breach of this Agreement shall be commenced within one year of the date of the breach, without regard to the date the breach is discovered. Any action not brought within that one year time period shall be barred, without regard to any other limitations period set forth by law or statute.`},
            ],

          }
          console.log("Boilerplates List Size :",help.boilerplates.length);
          res.json(help);
        }
      });

      /*
        const help= {
            ok:true,
            checklist : [
                'All parties intend to be bound are mentioned.',
             //   'Any and all parties necessary for agreement to be binding have signed, acknowledge and understand agreement.',
                'Mentions a valid date, clear full, legal names of any and all parties involved`',
                'Terms of the agreement are definite and certain',
                'Mentioned the jurisdiction you wish to follow',
             //   'Is signed fully within a month of creating.',
             //   'Parties signed are at least 18 unless providing legal guardin\'s sign as well.'
            ],
            snippets:[
                {id:101,tags:['names of parties'],text:`Please type the names of any and all parties necessary for this Agreement to occur. This agreement shall be binding upon the parties, their successors, assigns and personal representatives. Time is of the essence on all undertakings. This agreement shall be enforced under the laws of the State of ___________________________. This is the entire agreement.`},
        
                {id:102,tags:['Choice of Law and Forum Clause'],text:`This agreement shall be interpreted under the laws of the State of __________. Any litigation under this agreement shall be resolved in the trial courts of __________ County, State of _______________.`},
                
                {id:103,tags:['Brāv Clause'],text:`All disputes, controversies, or claims arising out of or relating to this contract shall be submitted binding arbitration in accordance with the applicable rules of Brāv then in effect.`},

                {id:104,tags:['Savings (Severability) Clause'],text:`If any provision of this Contract is held unenforceable, then such provision will be modified to reflect the parties' intention. All remaining provisions of this Contract shall remain in full force and effect.`},

                {id:105,tags:['Witness Clause'],text:`This agreement shall be binding upon the parties, their successors, assigns and personal representatives. Time is of the essence on all undertakings. This agreement shall be enforced under the laws of the State of ___________________________ This is the entire agreement.`},

                {id:106,tags:['Statute of Limitations Clause'],text:`The parties agree that any action in relation to an alleged breach of this Agreement shall be commenced within one year of the date of the breach, without regard to the date the breach is discovered. Any action not brought within that one year time period shall be barred, without regard to any other limitations period set forth by law or statute.`},
            ],
            boilerplates:[
                {id:101,tags:['family','divorce'],name:'General Agreement Boilerplate'},
                {id:102,tags:['Parental Custody'],name:'Parental Custody Agreement Boilerplate'},
                {id:103,tags:['Interpersonal Agreement'],name:'Interpersonal Agreement Boilerplate'},
            ]
        };
        res.json(help)
      */
    },
    
	getBoilerPlate:(req,res)=>{
      if(req.query.id && typeof req.query.id == 'string'){
        //console.log(req.query);
        let id = req.query.id;
        if(id=='101'){
             res.json({ok:true, plate: {_id:101,name:'sample',content :sampleBoilerPlate}} );
             return;
        }
        console.log("id", id);
        let reqData ={
          _id :1,
          name: 1,
          content : 1
        }
        let condition ={
          _id : uuidHelperService.makeObjectId(id),
          isFinal :true
        } 
        BoilerplateHelperService.getBoilerplateData( reqData, condition ,function(err, data){
          if(!err){
            res.json({ok:true, plate: data[0]} );
          }
          else{
            res.json({ok:false, message: "Failed to fetch data"} );
          }
        });
     }
     else{
        res.json({ok:false, message: "Missing params id"});
     }
    }
};

const sampleBoilerPlate = `
        THIS AGREEMENT, made this _____ day of__________, 20 ____, by and between _______________ (First Party) and ___________________ (Second Party) and _______________ (Third Party, etc).

        WITNESS: That in consideration of the mutual covenants and agreements to be kept and performed on the part of said parties hereto, respectively as herein stated, the said party of the first part does hereby promise and agree that it shall:



        I.





        II. And said party of the second part promises and agrees that it shall:





        III. Other terms to be observed by and between the parties:

        Merger and Integration Clause
        This Agreement and the exhibits attached hereto contain the entire agreement of the parties with respect to the subject matter of this Agreement, and supersede all prior negotiations, agreements and understandings with respect thereto. This Agreement may only be amended by a written document duly executed by all parties.

        Choice of Law and Forum Clause
        This agreement shall be interpreted under the laws of the State of __________. Any litigation under this agreement shall be resolved in the trial courts of __________ County, State of _______________.
        Statute of Limitations Clause
        The parties agree that any action in relation to an alleged breach of this Agreement shall be commenced within one year of the date of the breach, without regard to the date the breach is discovered. Any action not brought within that one year time period shall be barred, without regard to any other limitations period set forth by law or statute.

        Indemnification Clause
        The subcontractor agrees to indemnify and hold harmless the contractor against loss or threatened loss or expense by reason of the liability or potential liability of the contractor for or arising out of any claims for damages.

        Time of Performance Clause
        Time is (or is not EDIT) of the essence for the completion of the work described in this contract. It is anticipated by the parties that all work described herein will be completed within two (2) weeks of the date of execution, and that any delay in the completion of the work described herein shall constitute a material breach of this contract.

        -OR-
        Time is not of the essence

        The parties agree that time is not of the essence in the completion of the work described in this contract. All parties shall act to complete the work described within a reasonable time.

        Brāv Clause
        All disputes, controversies, or claims arising out of or relating to this contract shall be submitted binding arbitration in accordance with the applicable rules of Brāv then in effect.
        Savings (Severability) Clause
        If any provision of this Contract is held unenforceable, then such provision will be modified to reflect the parties' intention. All remaining provisions of this Contract shall remain in full force and effect.

        Attorney Fees Clause
        In the event of litigation relating to the subject matter of this Contract, the non-prevailing party shall reimburse the prevailing party for all reasonable attorney fees and costs resulting therefrom.

        Non-Waiver Clause
        The failure by one party to require performance of any provision shall not affect that party's right to require performance at any time thereafter, nor shall a waiver of any breach or default of this Contract constitute a waiver of any subsequent breach or default or a waiver of the provision itself.

        Liquidated Damages Clause
        For any rent paid after the ___day of the month, the tenant shall pay a late fee in the amount of $__ (not to exceed ___% of the monthly rent).

        This agreement shall be binding upon the parties, their successors, assigns and personal representatives. Time is of the essence on all undertakings. This agreement shall be enforced under the laws of the State of ___________________________. This is the entire agreement.

        Signed the day and year first above written.

        Signed in the presence of:



        ______________________________ ______________________________
        Witness First Party


        ______________________________ ______________________________
`;