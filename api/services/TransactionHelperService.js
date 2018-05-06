var uuidV1 = require('uuid/v1'); //timebased

module.exports = {

  createTxn: (userId, planJson, callback) => {
    // todo: create a transcaction and give a trxnId with hash of trxnid and price
    const tid = uuidV1();  //creates timebased txn id
    Transactions.native(function (err, Collection) {
      Collection.insert({
        txnId: tid,
        userId: userId,
        plan: {
          id: planJson.id,
          cost: planJson.cost,
          validity: planJson.validity,
          credits: planJson.credits
        },
        paymentAmount: planJson.cost,
        paymentSuccess: false,
        timeAtCreation: TimeHelperService.getNow(),
      },
        function (err2, inserted) {
          if (err2) {
            return callback(true, null);
          }
          else {
            callback(false, tid);
          }
        });
    })

  },

  get: (trxnId) => {
    // todo: give details of the trxn
    // Transactions.findOne({ txnId : trxnId }).exec(function (err, result) {
    //     if (err) {
    //         return callback(true);
    //     }
    //     console.log(result);
    // });
  },

  updateStatus: (trxnId, statusObj, callback) => {
    // this can be async
    // insert a status field in trxn and add a json with ok and message field ,
    // ok means true/false of success and message means reason if failure if there is one
  },

  saveCardDetailsHash: (userId, userCardStripeHash, date) => {
    // later we see
  }

}
