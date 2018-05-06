/**
 * Cases.js
 *
 */

module.exports = {

  attributes:{
    
    title: 'string',
    information: 'string',
    createdAt: 'datetime',
    creator: 'json', // {email,userId}
    involvedPeople: 'array', // 
    status: 'array', // {ts:'timestamp epoch', status : 'string'}
    rooms: 'json' , //
    discussionRoom: 'json' ,
    sessions:'array', 
    //privateRooms:'array', new model
  },

  discussionRoom :{
    name: 'string' ,
    id: 'string' ,
    members : [{email:'email',active:'boolean'}],
    active: 'boolean',
  },

  privateRooms:{
    name:'string',
    members :['email'],
    active:'boolean'
  },

  sessions :[{
    id:'string',
  }],

};

