/**
 * Created by Omkar Dusane on 26-Oct-16.
 */

module.exports = {
  getAllOrgProfiles: function (next) {
    Users.native(function (er1, c) {
      c.find({type:3},{email:1,_id:0,name:1,verified:1}).toArray(function(er2,docs){
        if(er2==null){
          next(true,docs);
        }else{
          next(false,null);
        }
      });
    });
  },
}
