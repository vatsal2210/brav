/**
 * Schedule.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 //Update : Vatsal : 2018-05-05 : Model from Br-Master
 
module.exports = {
  connection: 'mySqlLive',

  attributes: {
    title: {
      type: 'STRING',
      required: true
    },
    start: {
      type: 'STRING',
      required: true
    },
    end: {
      type: 'STRING',
      required: true
    },
    time: {
      type: 'STRING',
      required: true
    },
    availabilty: {
      type: 'string',
      required: true
    },
    description: {
      type: 'text',
      required: true
    }
  }
};

