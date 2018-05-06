module.exports={

  getAllBoilerPlate: function (next) {
    Boilerplate.native(function (er1, c) {
      c.find({},{ name:1, tags:1, isFinal: 1}).toArray(function(er2,docs){
        if(er2==null){
          next(true,docs);
        }
        else{
          next(false,null);
        }
      });
    });
  },

  getBoilerplateData : (req, condition,callback)=> {
    Boilerplate.native(function (err, Collection) {
      Collection.find(condition, req ).toArray(function(err2,docs){
        if(err2==null){
          //console.log(docs);
          callback(false,docs);
        }
        else{
          callback(true,null);
        }
      });
    });
  },

  createBoilerplate:(data,callback)=>{
    Boilerplate.findOne({name: data.title}).exec(function (err, bp) {
          if (err) {
            return callback(1, null); 
          }
          else if(!bp) {  //no same title boilerplate
            id = uuidHelperService.newObjectId();
            Boilerplate.native(function (err2, Collection){ 
                Collection.update({name: data.title},
                      {"$set": { _id: id, name: data.title, tags: data.includedTags, isFinal: false } },
                      {"upsert": true},
                      function(err3, updated){
                        if(err3) return callback(1, null);  //error
                        else {
                          //console.log(err3, err2, updated);
                          callback(0, id); //success
                        }
                      }  
                );
            });
          }
          else{  //same title exists
            callback(2);
          }
    })  
    
  },

	saveBoilerplate: ( id , update,callback)=>{
      Boilerplate.native((er1,Collection)=>{
            Collection.update(
                {
                    _id:uuidHelperService.makeObjectId( id),
                }, 
                { $set: update },
                { upsert:false },
                (er2,updateResult)=>{
                  console.log(er2, updateResult.result);
                    if(er2!=null){
                        return callback(2);
                    }
                    if(updateResult.result.nModified == 1)
                    {
                        callback(0);  //success
                    }
                    else {
                       callback(1);                  
                    }
                }
            );
      }); 
  },

  finalizeBoilerplate : (data ,callback)=>{
    Boilerplate.native((er1,Collection)=>{
            Collection.update(
                {
                    _id:uuidHelperService.makeObjectId( data.id),
                    isFinal:false
                }, 
                { 
                  $set: {
                          isFinal : true  
                          //content : data.content 
                        } 
                },
                { upsert:false },
                (er2,updateResult)=>{
                    console.log("Finalized: err/result",er2, updateResult.result);
                    if(er2!=null){
                        console.log(er2);
                        return callback(true);
                    }
                    if(updateResult.result.nModified == 1)
                    {
                        callback(false);
                    }
                    else{
                       callback(true);                  
                    }
                }
            );
    }); 
  },

  removeBoilerPlate : (id, callback)=>{
    //let objId = uuidHelperService.makeObjectId( id);
    Boilerplate.native((err,c)=>{
      if(err != null){
        return callback(true);
      }
      c.remove(
                {
                  _id:uuidHelperService.makeObjectId(id),
                }, 
                (er2,del)=>{
                    console.log('Remove Result/ Err : ',del.result, er2);
                    if(er2!=null){
                        return callback(true);
                    }
                    if(del.result.n == 1)
                    {
                        callback(false); //deleted
                    }else{
                        callback(true);
                    }
                }
            );
    });
  }
  
}