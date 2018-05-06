/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  flags:{
    INDIVIDUAL: 4,
    ORG:3,
    MEDIATOR:2,
    MEDIATOR_ORG:22,
    ADMIN:1
  },

  attributes: {
    email : {
      type:'string',
      unique: true
    },
    tz:'string',
    name : 'string',
    password : 'string',
    agree:'boolean',
    type:'integer',
    profile : 'json', 

    //Update : Vatsal : 2018-05-05 : From Br-master
    firstname : {
      type: 'STRING',
      required: true
    },
    middlename : {
      type: 'STRING'
    },
    lastname : {
      type: 'STRING'
    },
    username : {
      type: 'STRING',
      email: true,
      required: true,
      unique: true
    },
    password : {
      type: 'STRING',
      required: true
    },
    online : {
      type: 'BOOLEAN',
      default: false
    }
  },


  innerObjects:{ // just for writing Its never used
    stripeConnection:{
      
    },
    profile_2: // for mediator
      {
        approved:'boolean',
        proMediatorStatusRequested :'boolean',
        proMediatorStatusApproved :'boolean',
        description:'string',
        experience:'string',
        rate:'integer',
        hasInternationalInsurance:'boolean',
        autoAccept:'boolean',
        specialities:[
          'string'
        ],
      }
  }

};

