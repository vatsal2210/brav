/**
 * MediatorController
 *
 * @description :: Server-side logic for managing mediators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /** v0.3 : Feb - 2017 */

  /** mediator org */
  /* createMediatorOrganization :(req,res)=>{
     /** params : creatoremail,creatorname,orgname,contact  */
  /*  MediationSessionService.createOrg();
    res.json({ok:true})
  },*/
  getMyMediationCompany: (req, res) => {
    console.log("getMyMediationCompany", req.authDecoded.email);
    let eid = req.authDecoded.email;
    mediationCompanyHelperService.getAllOrgsByMediatorId(eid, function (ok, doc) {
      if (ok) {
        console.log("Companies:", doc);
        res.json({ ok: true, data: doc });
      }
      else {
        res.json({ ok: false, message: "You are not a part of any company yet!" });
      }
    });

  },

  checkMemberValidity: (req, res) => {
    console.log("Inside MediatorController->checkMemberValidity", req.body.email, req.authDecoded.email);
    if (req.body.email == req.authDecoded.email) {
      return res.json({ ok: false, message: "You'll be member of this company by default!" });
    }
    mediatorService.getIdByEmail(req.body.email, function (found, id) {
      console.log(found, id);
      if (found) {
        res.json({ ok: true, id: id });
      }
      else {
        res.json({ ok: false, message: "Mediator does not exist!" });
      }
    });
  },

  createMediatorOrganization: (req, res) => {
    console.log("authDecoded ", req.authDecoded);
    console.log("Inside MediatorController->createMedCompany ", req.body);
    let companyDetails = { involvedParties: [] };
    if (!!req.body.Name && !!req.body.phone && !!req.body.country && !!req.body.Address && !!req.body.currency && !!req.body.orgEmail) {
      companyDetails.name = req.body.Name.trim();
      companyDetails.contact = {
        "phone": req.body.phone,
        "address": req.body.Address.trim(),
        "email": req.body.orgEmail
      };
      companyDetails.country = req.body.country.trim();
      companyDetails.currency = req.body.currency;

      if (companyDetails.name.length < 1 && companyDetails.contact.phone.length < 10 && companyDetails.country.length < 1 && companyDetails.contact.address.length < 1 && companyDetails.contact.email.length < 1 && companyDetails.currency.length < 1) {
        res.json({ ok: false, message: 'Invalid values for params' });
        return;
      }
    }
    else {
      res.json({ ok: false, message: 'Missing params' });
      return;
    }

    companyDetails.creator = req.authDecoded.email;

    //Add creator as member
    companyDetails.members = [{
      email: companyDetails.creator,
      requestedAt: TimeHelperService.getNow(),
      responded: TimeHelperService.getNow(),
      accepted: true,
      isMember: true
    }];

    //push other mediators as members, if any
    if (!!req.body.involvedParties) {
      for (var i = 0; i < req.body.involvedParties.length; i++) {
        companyDetails.members.push({
          email: req.body.involvedParties[i],
          requestedAt: TimeHelperService.getNow(),
          responded: false,
          accepted: false,
          isMember: false
        });
      }

    }

    console.log("Inside MediatorController->createMedCompany: ", companyDetails);
    mediationCompanyHelperService.createMediationCompany(companyDetails,
      resObject => res.json(resObject)
    );
  },

  respondToMediaionOrganizationJoinRequest: (req, res) => {

  },
  /** Mediation Session */

  addToMyProfile: (req, res) => {
    console.log('body ', req.body);
    /** params: (all optional) description , experience , rate (in $Cents per hour), autoAccept hasInternationalInsurance */
    let list = ['name', 'description', 'experience', 'specialities', 'rate', 'autoAccept', 'hasInternationalInsurance', 'proMediatorStatusRequested'];
    let profile = {};
    if (req.body.profile['rate']) {
      let rateDollors = 0;
      if (typeof req.body.profile.rate == 'string') {
        rateDollors = Number(req.body.profile.rate);
      }
      profile['profile.rate'] = rateDollors * 100; // This is rate in cents
    }
    if (req.body.profile['currency']) {
      /* 
        currencies = [
          {name:'United States Dollar, USD', code:'USD'},
          {name:'British Pound, GBP', code:'GBP'},
          {name:'Euro, EUR', code:'EUR'},
        ]
      */
      if (typeof req.body.profile.currency == 'string') {
        profile['profile.currency'] = (req.body.profile.currency); // This is currency
      }
    }
    if (req.body.profile['autoAccept']) {
      if (typeof req.body.profile.autoAccept == 'string') {
        profile['profile.autoAccept'] = (req.body.profile.autoAccept == 'true');
      }
    }
    if (req.body.profile['proMediatorStatusRequested']) {
      if (typeof req.body.profile.proMediatorStatusRequested == 'string') {
        profile['profile.proMediatorStatusRequested'] = (req.body.profile.proMediatorStatusRequested == 'true');
      }
    }
    if (req.body.profile['hasInternationalInsurance']) {
      if (typeof req.body.profile.hasInternationalInsurance == 'string') {
        profile['profile.hasInternationalInsurance'] = (req.body.profile.hasInternationalInsurance == 'true');
        if (!profile['profile.hasInternationalInsurance']) {
          profile['profile.approved'] = false;
        }
      }
    }
    if (req.body.profile['specialities']) {
      // console.log('lets check if specialities is array : type is= ',typeof req.body.profile.specialities); object hai
      profile['profile.specialities'] = req.body.profile.specialities;
    }
    if (req.body.profile['experience']) {
      profile['profile.experience'] = req.body.profile.experience;
    }
    if (req.body.profile['description']) {
      profile['profile.description'] = req.body.profile.description;
    }
    if (req.body['name']) {
      profile['name'] = req.body.name;
    }
    if (req.body['tz']) {
      profile['tz'] = req.body.tz;
    }
    //console.log('lets see profile ',profile);
    mediatorService.addToProfile(req.authDecoded.email, profile, (ok) => {
      res.json({ ok: ok, message: 'success' });
    });
  },

  getMyProfile: function (req, res) {
    mediatorService.getMediatorProfileForSelf(req.authDecoded.email, function (ok, doc) {
      if (ok) { res.json({ ok: true, message: 'have the data', profile: doc }) }
      else { res.json({ ok: false, message: 'No details found' }) }
    })
  },

  /** v0.3 :Ends */

  //Update: Vatsal : 2018-05-05 : From Br-master
  index: function (req, res) {
    if (req.session.userId && req.session.loggedin && req.param('id') && req.session.userId == req.param('id')) {
      UserService
        .checkLogin(req.session.userId)
        .exec(function (err, ress) {
          if (err) {
            ress.redirect('/');
          }
          else if (!ress) {
            ress.redirect('/');
          }
          else {
            res.render('pages/mediator', { _layoutFile: '../shared/mediator_layout.ejs', id: req.param('id') });
          }
        });
    } else {
      res.redirect('/');
    }
  }

};


