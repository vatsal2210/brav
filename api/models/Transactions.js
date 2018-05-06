/**
 * Transactions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    txnId: 'integer',

    userID: 'string', //emailId

    plan: {
      type: 'json' /** {_id, cost, validity, credits} **/
    },
    //whole json of plan}	

    timeAtCreation: 'datetime' ,

    timeAtPayment: 'datetime',

    stripeReference:{
      //what about this?
    },

    paymentAmount:{
      type: 'integer',
    },

    paymentSuccess:{
      type: 'boolean',
    }

  }
};

