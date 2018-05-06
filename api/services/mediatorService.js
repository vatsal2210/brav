
/**
 * Created by Omkar Dusane on 24-Oct-16.
 */
// mediatorService

module.exports = {

  /** feb 2017 */

  getIdByEmail: function (email, next) {
    Users.native(function (er1, collection) {
      collection.findOne({ email: email, type: 2 }, { _id: 1 }, function (er2, doc) {
        console.log(doc);
        if (er2 == null && doc) {
          next(true, doc._id)
        } else {
          next(false, null)
        }
      })
    });
  },

  getAllMediatorPublicProfiles: (next) => {
    Users.native(function (er1, collection) {
      collection.find({
        type: Users.flags.MEDIATOR,
        //   'profile.approved':true,
        //   'profile.hasInternationalInsurance':true,
      },
        { profile: 1, _id: 1, name: 1, email: 1, tz: 1 }).toArray(function (er2, docs) {
          if (er2 == null) {
            next(true, docs) // ok=true , 
          } else {
            // db error
            next(false, null) // ok = false
          }
        })

    });
  },

  getMediatorPublicProfile: (id, next) => {
    Users.native(function (er1, collection) {
      collection.find({
        _id: uuidHelperService.makeObjectId(id),
      },
        { profile: 1, _id: 1, email: 1, name: 1, tz: 1 }, function (er2, doc) {
          if (er2 == null && !!doc) {
            next(true, doc)
          } else {
            // db error
            next(false, null)
          }
        })

    });
  },

  addToProfile: (email, profile, next) => {
    Users.native(function (er1, collection) {
      collection.update(
        { email: email },
        { '$set': profile },
        function (err2, result) {
          if (err2) {
            next(false)
          }
          else {
            next(true);
          }
        }
      )
    });
  },

  getMediatorProfileForSelf: function (email, callback) {
    Users.native(function (er1, collection) {
      collection.find(
        { email: email, type: Users.flags.MEDIATOR },
        { email: 1, type: 1, name: 1, profile: 1, tz: 1 }).toArray(function (err, doc) {
          if (err == null) {
            if (doc.length == 0) {
              callback(false, null);
            } else {
              callback(true, doc[0]);
            }
          }
        })
    })
  },

  getMediatorMiniProfilesForMediationSession: (mediatorsArray, next) => {
    let ids = [];
    let emails = [];
    mediatorsArray.forEach((m) => {
      if (!!m.id) {
        ids.push(uuidHelperService.makeObjectId(m.id));
      } else if (m.email) {
        emails.push(m.email);
      }
    });
    Users.native((er1, c) => {
      if (er1) { return next({ ok: false }) }
      c.find({
        $or: [
          { _id: { $in: ids } },
          { email: { $in: emails } },
        ]
      }, {
          _id: 1,
          email: 1,
          name: 1,
          'profile.rate': 1,
          'profile.currency': 1,
          'profile.autoAccept': 1
        }).toArray((er2, docs) => {
          if (er2) { return next({ ok: false }) }
          return next({ ok: true, docs: docs });
        });
    });
  },

  changeMediatorApproval: (condition, change, callback) => {
    //id = uuidHelperService.makeObjectId(data.id);
    Users.native(function (err2, Collection) {
      Collection.update(condition,
        { $set: change },
        { "upsert": false },
        function (err3, updated) {
          console.log("Change:", err3, err2, updated.result);
          if (err3) {
            return callback(true, null);  //error
          }
          else if (updated.result.nModified == 1) {
            return callback(false, updated); //success
          }
          else { return callback(true); }
        }
      );
    });

  },

  changeProStatus: (condition, change, callback) => {
    Users.native(function (err2, Collection) {
      Collection.update(
        condition
        ,
        {
          $set: change
        },
        { "upsert": false },
        function (err3, updated) {
          console.log("Change:", err3, err2, updated.result);
          if (err3) {
            return callback(true);  //error
          }
          else if (updated.result.nModified == 1) {
            return callback(false); //success
          }
          else { return callback(true); }
        }
      );
    });
  },

  /* PayOuts related : only accessible to Admins*/

  addBankDetails: () => {
    // https://stripe.com/docs/api#account_create_bank_account
    // 
  },

  payOutForSession: () => {

  },

  /* pauouts end */
}
