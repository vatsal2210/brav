/**
 * SessionCredits.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    userId: {
      type: 'string' // email id of user 
    },

    available: { 	// decrease everytime a session is created 
      type: 'integer'
    },

    track: {
      type:"json",
    }
    /*[ 
     {	bucketId: 'integer',//TrxnId,
     count: 'integer' ,// increase everytime a session is created
     expiryDate: 'datetime'
     }
     ],*/

  }
};

