/**
 * CaseController
 *
 * @description :: Server-side logic for managing Cases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let CaseActionFlags = {
  OFFER_DISCOUNT: 10,

  INITIALIZE_PAYMENT: 21,
  CANCEL_PAYMENT: 22,
  COUPON_CODE: 31,

  SCHEDULE_SESSION: 41
}
module.exports = {

  createCase: (req, res) => {
    /** params : title , info  */
    const body = req.body;
    if (!!body.title && !!body.info) {
      let creator = { email: req.authDecoded.email, type: req.authDecoded.type }
      CaseService.createCase(body.title, body.info, creator, (resMsg) => {
        res.json(resMsg);
      });
    } else {
      res.json({ ok: false, message: 'Missing Params' })
    }
  },

  modifyCase: (req, res) => {
    /** params : title info */
    if (!!req.body.title && !!req.body.info) {
      CaseService.updateCase(req.body.title, req.body.info, req.authDecoded.email, (resMsg) => {
        res.json(resMsg);
      });
    } else {
      res.json({ ok: false, message: 'Missing Params' })
    }
  },

  updateCaseStatus: (req, res) => {
    /** params : statusMessage ,title */
    if (!!req.body.title && !!req.body.statusMessage) {
      CaseService.updateCaseStatus(req.body.statusMessage, body.title, req.authDecoded.email, (resMsg) => {
        res.json(resMsg);
      });
    } else {
      res.json({ ok: false, message: 'Missing Params' })
    }
  },

  getAllCases: (req, res) => {
    CaseService.getAllCasesByCreatorEmail(req.authDecoded.email, (resMsg) => {
      res.json(resMsg);
    })
  },

  // To create Sessions
  getMediatorProfiles: (req, res) => { // Later put limit of 50
    mediatorService.getAllMediatorPublicProfiles((ok, docs) => {
      if (ok) {
        res.json({ ok: true, message: 'Here are all mediators', list: docs });
      } else {
        res.json({ ok: false, message: 'some error occurred' })
      }
    });
  },

  getMediatorProfile: (req, res) => {
    if (!!req.body.id) {
      mediatorService.getMediatorPublicProfile(id, (ok, doc) => {
        if (ok) {
          res.json({ ok: true, message: 'Here is profile', profile: doc })
        } else {
          res.json({ ok: false, message: 'Not found' })
        }
      });
    } else {
      res.json({ ok: false, message: 'Missing param id' })
    }
  },

  /** Create Session (SessionRequest)API */
  createMediationSession: (req, res) => {
    /** params: title, hours, description , caseTitle ,individualsArray ,mediatorsArray ,   */
    let sessionObject = {};
    let individualsArray = [];
    let mediatorsArray = [];
    let list = ['description', 'hours', 'title'];
    let toReturn = false;
    list.forEach(li => {
      if (req.body[li]) {
        sessionObject[li] = req.body[li];
      } else {
        res.json({ ok: false, message: 'Missing param :' + li })
        toReturn = true;
      }
    });
    if (req.body.case && req.body.case._id && req.body.case.title) {
      sessionObject.case = { _id: req.body.case._id, title: req.body.case.title };
    }
    if (req.authDecoded.type == Users.flags.INDIVIDUAL) {
      individualsArray.push({ email: req.authDecoded.email, responded: false });
    } else if (req.authDecoded.type == Users.flags.MEDIATOR) {
      mediatorsArray.push({ email: req.authDecoded.email, responded: false })
    }
    // calculate price here

    // individuals array fashion
    if (!!req.body.individualsArray) {
      req.body.individualsArray.forEach((i) => {
        if (i != req.authDecoded.email) {
          individualsArray.push({ email: i, responded: false });
        }
      });
    }
    else {
      console.log('no other emails in createsession')
    }
    if (!!req.body.mediatorsArray) {
      req.body.mediatorsArray.forEach((m) => {
        // Check m must be an email and not mongoId
        let toPush = { responded: false }
        if (uuidHelperService.isObjectId(m)) {
          toPush.id = m;
        } else {
          toPush.email = m;
        }
        mediatorsArray.push(toPush);
      });

    } else if (mediatorsArray.length == 0) {
      res.json({ ok: false, message: 'Missing params : mediatorsArray' });
      return;
    }
    if (toReturn) { res.json({ ok: false, message: 'something wrong' }); return; }
    mediatorService.getMediatorMiniProfilesForMediationSession(mediatorsArray, (mediatorsLookup) => {
      if (mediatorsLookup.ok) {
        // Go ahead and respond now !
        /** code here if mediator has autoAccept */
        mediatorsArray = mediatorsArray.map((medi) => {
          let currentMedi = mediatorsLookup.docs.find((medi_from_docs) => {
            if (medi.id) {
              console.log(medi, "--Comparing with--", medi_from_docs);
              return (medi_from_docs._id == medi.id);
            } else if (medi.email) {
              return (medi.email == medi_from_docs.email);
            }
            return false;
          });
          if (currentMedi) {
            medi.name = currentMedi.name;
            medi.email = currentMedi.email;
            medi.id = currentMedi._id;
            if (currentMedi.profile) {
              medi.rate = currentMedi.profile.rate;
              medi.currency = currentMedi.profile.currency;
              if (currentMedi.profile.autoAccept) {
                medi.responded = true;
                medi.accepted = 'true';
              }
            } else {
              medi.rate = false;
            }
            return medi;
          } else {
            medi.notAUser = true;
            return medi;
          }
        });
        MediationSessionService.createSession(
          sessionObject,
          { // creator
            email: req.authDecoded.email,
            type: req.authDecoded.type
          },
          individualsArray,
          mediatorsArray,
          (resObject) => { res.json(resObject); }
        );
      } else {
        res.json({ ok: false, message: 'issue in retriving mediators list' })
      }
    });
  },

  getAllMediationSessionRequests: (req, res) => {
    MediationSessionService.getMediationSessionRequests({ yes: false }, req.authDecoded.email, req.authDecoded.type, (resObject) => {
      res.json(resObject);
    });
  },

  /* /common/api/ms/request/one' */
  getOneMediationSessionRequest: (req, res) => {
    // params id ,
    if (!req.query.id) {
      res.json({ ok: false, message: 'missing params : id' });
      return;
    }
    MediationSessionService.getMediationSessionRequests({ yes: true, sessionId: req.query.id }, req.authDecoded.email, req.authDecoded.type, (resObject) => {
      res.json(resObject);
    });
  },

  /** Session Request Dynamics **/
  respondToMediationRequest: (req, res) => {
    // identify indiv / org / mediator or anyone and go
    if (req.body.id && req.body.accept) {
      if (req.authDecoded.type == Users.flags.MEDIATOR) {
        let rate = false;
        if (req.body.rate) {
          rate = req.body.rate;
        };
        MediationSessionService.respondSessionByMediator(req.body.id, req.authDecoded.email, req.body.accept, rate,
          resObject => res.json(resObject)
        );
      } else if (req.authDecoded.type == Users.flags.INDIVIDUAL) {
        MediationSessionService.respondSessionByIndividual(req.body.id, req.authDecoded.email, req.body.accept,
          resObject => res.json(resObject)
        );
      }
    } else {
      res.json({ ok: false, message: 'missing params : id or accept' })
    }
  },

  actionsToMediationRequest: (req, res) => {
    let notAllowed = () => {
      res.json({ ok: false, message: 'Not allowed to do this action' })
      return;
    };
    let scheduler = () => {
      if (req.body.data.newEpoch && !isNaN(req.body.data.newEpoch)) {
        MediationSessionService.scheduleSession(req.body.id, req.body.data.newEpoch, req.authDecoded.email, resObject => {
          res.json(resObject);
        });
      }
      else {
        notAllowed();
      }
    };
    let alterPay = k => {
      MediationSessionService.alterPayment(k, req.body.id, req.authDecoded.email, req.body.data, resObject => {
        res.json(resObject);
      });
    };
    if (req.body.id && req.body.action && req.body.data) {
      req.body.action = Number(req.body.action);
      if (req.authDecoded.type == Users.flags.MEDIATOR) {

        if (req.body.action == CaseActionFlags.OFFER_DISCOUNT) {
          let rates = {
            newRate: Number(req.body.data.newRate),
            diff: Number(req.body.data.oldRate) - Number(req.body.data.newRate),
          };
          if (rates.diff) {
            if (rates.diff) {
              MediationSessionService.offerDiscount(req.body.id, req.authDecoded.email, rates, function (resObject) {
                res.json(resObject);
              });
            } else {
              notAllowed();
            }
          }
        } else if (req.body.action == CaseActionFlags.SCHEDULE_SESSION) {
          scheduler();
        } else {
          notAllowed();
        }

      } else if (req.authDecoded.type == Users.flags.INDIVIDUAL || req.authDecoded.type == Users.flags.ORG) {

        if (req.body.action == CaseActionFlags.INITIALIZE_PAYMENT) {
          alterPay(1);
        } else if (req.body.action == CaseActionFlags.CANCEL_PAYMENT) {
          alterPay(2);
        } else if (req.body.action == CaseActionFlags.COUPON_CODE) {
          alterPay(3);
        } else if (req.body.action == CaseActionFlags.SCHEDULE_SESSION) {
          scheduler();
        } else {
          notAllowed();
        }
      }
      //notAllowed();
    } else {
      res.json({ ok: false, message: 'missing params : id or action and data' })
    }
  },

  /* /common/api/ms/pay */
  payNow: (req, res) => {
    if (req.body.trxnId && req.body.stripeToken && req.body.amount) {
      let sessionId = req.body.trxnId;
      MediationSessionService.getMediationSessionRequests({ yes: true, sessionId: sessionId }, req.authDecoded.email, req.authDecoded.type, resultObject => {
        if (resultObject.ok) {
          //console.log('COSTS In request :',req.body.amount)
          let descriptionData = {
            session: resultObject.session.sessionObject,
            mediatorPayouts: [],
            costs: resultObject.session.costs,
            paid_by: req.authDecoded.email,
            involvedMediatorsArray: resultObject.session.mediators,
          };
          descriptionData.involvedMediatorsArray.forEach(medi => {
            if (medi.responded) {
              if (medi.accepted == 'true') {
                medi.totalAmountToPay_BeforeBravCommission = (Number(resultObject.session.sessionObject.hours) * medi.rate) + ' US Cents';
                medi.toPayThisPerson = true;
                descriptionData.mediatorPayouts.push(medi);
              } else {
                medi.toPayThisPerson = false;
              }
            } else {
              medi.toPayThisPerson = false;
            }
          });
          MediationSessionService.makePayment(
            sessionId, 
            req.authDecoded.email, 
            req.body.stripeToken,
            resultObject.session.costs.payable, 
            resultObject.session.costs.currency,
            descriptionData,
            resObject => {
              if (resObject.ok) {
                res.json({ ok: true, message: 'Payment Successful' });
              } else {
                res.json({ ok: false, message: 'Payment Failed due to resObject', resObj: resObject });
              }
            });
        } else {
          res.json(resultObject);
        }
      });
    } else {
      res.json({ ok: false, message: 'Missing params ' })
    }
  },

  /** After Payment is done and confirmed  */
  getAllMediationSessions: (req, res) => {
    MediationSessionService.getMediationSessions({ yes: false }, req.authDecoded.email, req.authDecoded.type, (resObject) => {
      res.json(resObject);
    });
  },

  getOneMediationSession: (req, res) => {
    // params id ,
    if (!req.query.id) {
      res.json({ ok: false, message: 'missing params : id' });
      return;
    }
    MediationSessionService.getMediationSessions({ yes: true, sessionId: req.query.id }, req.authDecoded.email, req.authDecoded.type, (resObject) => {
      res.json(resObject);
    });
  },

};

