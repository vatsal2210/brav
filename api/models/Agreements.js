/**
 * Agreements.js
 *
* @description :: TODO: You might write a sho~rt summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  flags:{
    PAYMENT_NOT_INITIATED:10,
    PAYMENT_INITIATED:11,
    PAYMENT_DONE:12,
  },
  attributes: {
    title:'string',
    description:'string',
    checklist:'array', // {item, checked } // date_added, all_18_up , parents_u_18, signed ,
    creator:'json', // {email, type}
    content:'json', // {html}
    involvedParties: 'array' , // [{email,invited,attention,signed{date,ip,mac},rejected,is18,parent]
    signingParties:'array',
    isFinal:'boolean',
    createdAt:'datetime',
    expiryAt:'datetime',
    payment :'json', //{ref, status}
    }
};

