module.exports = {
add : (userId,credits,expiryDate)=>{
    // todo: add to users credits
},
get : (userId,callback)=>{
  // todo: get all credits of user with expiry dates
},
checkAvailability:(userId,date,callback)=>{
  // self explaining
},
useOneIfAvailable:(userId,date,callback)=>{
  // todo: check availability if thats true then decrement one and go ahead 
},
getFarthestExpiryDate:(userId,callback)=>{
  // todo: get the last date of which a session can be cretad by this user
},
}
