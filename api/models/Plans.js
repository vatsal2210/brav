/**
 * Plans.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
/*

 module.exports = {
 autoPK: true,
 autoCreatedAt: true,
 autoUpdatedAt: true,
 attributes: {
 description :'string',
 planid:'string',
 cost:'integer',
 active:'boolean'
 }
 };
 */


module.exports = {
  attributes : {
    planName: {
      type:'string',
      unique: true,
      required: true
    },

    description: {
      type:'string',
      required: true
    },

    cost:{
      type:'integer',
      required: true
    },

    mediator :{
      type:'boolean'
    },

    medOrg:'boolean',

    org: {
      type:'boolean'
    },

    active: {
      type: 'boolean',
      required: true
    },

    validitiy: {
      type: 'integer'  //no of days
    },

    credits: {
      type: 'integer',  // no of sessions permitted
      required: true
    }
  }
};
