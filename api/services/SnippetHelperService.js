module.exports={
  createSnippet:(text, tag,callback)=>{
    console.log(text,tag);
    Snippet.findOne({text: text}).exec(function (err, res) {
        //console.log(res);
          if (err) {
            return callback(1, null); 
          }
          else if(!res) {  //no same snippet
            id = uuidHelperService.newObjectId();
            Snippet.native(function (err2, Collection){ 
                Collection.update({text: text},
                      {"$set": { _id: id, text: text, tags:tag } },
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
            callback(2, null);
          }
    })  
    
  },
}