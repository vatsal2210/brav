bravAdmin.controller('boilerplateCtrl', function($scope,apicalls,sharedProperties) {
  console.log('loaded bravAdmin contrller');
  //$scope.stuff = {};
  $scope.drafting = true;
  $scope.showConfirm = false;
  //$scope.back = false;
  $scope.title='';
  $scope.tagsArray=[];

  //$scope.mainTitle = "Create Boilerplate";

  $scope.clearScope = function() {
    $scope.mainTitle = "Create Boilerplate";
    $scope.title='';
    $scope.tagsArray=[];
    $scope.text = '';
    $scope.boilerplateId = '';
    $scope.isFinal=false;
    $scope.showEdit = '';

    $scope.snippet = [];
    $scope.boilerplate1 = [];
    $scope.bplate='';
    $scope.bptext='';
    //$scope.drafting = '';
    $scope.agreement = {};
    $scope.individualsArray = [];
    //$scope.fcheck = false;
    $scope.drafting = true;
    $scope.showConfirm = false;
    //$scope.back = false;
    $scope.content='';
    $scope.checklist = [];
    $scope.snippets = [];
    $scope.boilerplates = [];
    $scope.allBp = [];

  };

  $scope.clearScope();

  $scope.trixChange = function(e, editor) { // required for Saving Agreement
      $scope.bptext = e.target.value;
      console.log($scope.bptext);
   };

  $scope.flipper = function() {
    console.log("flipper",$scope.drafting);
    $scope.drafting = !$scope.drafting;
  };

  $scope.insertTag = function(tag,array) {
    $scope.errorTag = '';
    console.log("->",tag);
    if(!tag || tag.trim() == '') {
      $scope.errorTag = 'Its a compulsory field!';
      return;
    }

    var doesnotExists = $scope.tagsArray.indexOf(tag) == -1;
    if(doesnotExists) {
       // $scope.tagsArray.push(tag);
      $scope.tagsArray = sharedProperties.insertTag(tag,$scope.tagsArray);
        $scope.bplate.tags = '';
      }
   /*  var c=[];
     c = sharedProperties.insertTag(tag,array);
    if(!c.lenght)
      $scope.errorTag = 'Its a compulsory field!';
    else{
      $scope.tagsArray=c;
      $scope.bplate.tags = '';
    }*/
  };

  $scope.removeTag = function($index,tagsArray) {
   // $scope.individual = $scope.tagsArray.splice($index,1)[0];
   $scope.individual=sharedProperties.removeTag($index,tagsArray);
  };

  $scope.createBoilerPlate = function(title) {
    if(title && $scope.tagsArray.length) {

      var data = {
        title:title,
        includedTags: $scope.tagsArray
      };
      $scope.title=title;
      $scope.tags=$scope.tagsArray;
      console.log($scope.tagsArray);

      apicalls.createBoilerPlate(data,function(res) {
        console.log(' create boiler plate-bravadmin.controller.js');
        console.log(' create bplate response ',res);
        if(res.ok) {
          $scope.showEdit = true;
          $scope.boilerplateId = res.id;
          $scope.stuff = res.agreementDetailsObject;
          swal({
            title: 'Boiler Plate Created',
            type: 'success'
            });
        }
        else{
          swal({
            title: res.message,
            type: 'error'
          });
        };
      });
    }
    else {
      swal({
          title: 'Please Fill all fields',
          type: 'error'
      });
    }
  };

  $scope.editBpDetails = function(agreement) {
    var data = {
        title:agreement.title,
        includedTags: $scope.tagsArray,
        id : $scope.boilerplateId
      };
      console.log('Edit agreement data',data );

      apicalls.saveBpDetails(data,function(res) {
        console.log(' response received', res);
        if(res.ok) {
          swal({
            title: res.message,
            type: 'success'
          });
        }
        else{
          swal({
            title: res.message,
            type: 'error'
          });
         }
       }) ;
  };

  $scope.saveBoilerplate = function() {
    console.log("bravAdmin controller-scope.saveBoilerplate");

    var data = {
      id : $scope.boilerplateId,
      content: $scope.bptext
    };

    console.log("boilerplate data: ", data);

    apicalls.saveboilerplates(data,function(res) {
      console.log('Boilerplan response received', res);
       if(res.ok) {
        swal({
          title: res.message,
          type: 'success'
        });
        $scope.isFinal=false;
      }
      else{
        swal({
            title: res.message,
            type: 'error'
        });
      }

    });

  };

  $scope.finalize = function() {
   // console.log("showConfirm", $scope.showConfirm);
    // $scope.showConfirm = ! $scope.showConfirm;
    swal({
        title: "Do you want to publish this boilerplate?",
        text: "It will be available in agreements!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",confirmButtonText: "Yes!",
        cancelButtonText: "No!"
      }).then(
            function(result){
              $scope.finalizeBP2();
               $scope.back();

                 // swal("Saved!", "You can access in draft!.", "success");
            },
            function(dismiss) {
              $scope.cancelBoilerPlate();
                  //swal("Deleted!", "You can exit now :)", "error");
            }
      );
    //  $scope.back();
  };

  $scope.finalizeBP2 = function() {
    console.log("bravAdmin controller-scope.finalizeBP2");

    var data = {
      id : $scope.boilerplateId
      //content: $scope.bptext
    };

    console.log("boilerplate data: ", data);
    apicalls.finalizeboilerplates(data,function(res) {
      console.log('Final Boilerplate response received', res);
        if(res.ok) {
          swal({
            title: res.message,
            type: 'success'
          });
          $scope.isFinal=true;
        }
        else{
          swal({
            title: res.message,
            type: 'error'
          });
        }
    });
  };

  $scope.back = function() {

    $scope.flipper();
    $scope.clearScope();
  };


  $scope.loadBoilerPlate = function(){
    console.log('inside load boilerplate function')
    apicalls.getAllBoilerPlate(function(res) {
      console.log('BoilerPlate Info received', res);
         $scope.allBp= res;
        console.log($scope.allBp);

   });
  };

  //>>>>>>>>>>
  let doWeHaveSomethingToEdit = apicalls.getBPStuff();

  // this is for edit old boilerplate
  if(doWeHaveSomethingToEdit){
    // $scope.clearScope();
    console.log("Edit bp data:",doWeHaveSomethingToEdit);
    $scope.mainTitle = "Edit Boilerplate ";
    $scope.isFinal = doWeHaveSomethingToEdit.isFinal;
    $scope.showEdit = doWeHaveSomethingToEdit.editable ;
    $scope.boilerplateId = doWeHaveSomethingToEdit._id;
    $scope.title = doWeHaveSomethingToEdit.name;
    $scope.bptext = doWeHaveSomethingToEdit.content;
    $scope.tagsArray = doWeHaveSomethingToEdit.tags;
  }

  //<<<<<<<<<<<<<

  $scope.editBP = function(bp){
    console.log('inside edit boilerplate function');
    var eid = bp._id;
    apicalls.getBPContent(eid);


  };

  $scope.deleteBP = function(id){
    console.log('inside delete boilerplate function');
    console.log(id);
    apicalls.deleteBoilerPlate(id,function(res) {
      if(res.ok){
        console.log('BP deleted');
        $scope.loadBoilerPlate();
      }
      else{
        console.log("Error");
      }
   });
  };

});


bravAdmin.controller('mediatorCtrl', function($scope,apicalls){

  console.log("Bravadmin : mediatorCtrl");
  $scope.allMed = [];
  $scope.loadMed = function(){
    apicalls.getAllMediators(function(res) {
      console.log('Mediators Info received', res);
         $scope.allMed = res;
        console.log($scope.allMed);
   });
  };

  $scope.approveMed= function(index, mid) {
    var status = $scope.allMed[index].profile.approved;
    console.log(mid, status);

    let data = {
      eid: mid, //email
      currentStatus : status
    }

    //before sending req, add alert to confirm ?
    apicalls.medApproval(data, function(res) {
      console.log("Change med status response");

      if(!res.ok){
        swal({
            title: res.message,
            type: 'error'
            });
      }
      else{
       //$scope.allMed[index].profile.approved = !status;
       //or refresh the page;
       $scope.loadMed();
      }

    });

  };

  $scope.revokeMed= function(index, mid) {
    var status = $scope.allMed[index].profile.approved;
    console.log(mid, status);

    let data = {
      eid: mid, //email
      currentStatus : status
    }
    //before sending req, add alert to confirm ?
    apicalls.revokeApproval(data, function(res) {
      console.log("Change med status response");

      if(!res.ok){
        swal({
            title: res.message,
            type: 'error'
            });
      }
      else{
       //$scope.allMed[index].profile.approved = !status;
       //or refresh the page;
       $scope.loadMed();
      }

    });

  };

  $scope.makePro= function(index, mid) {
    //var prostatus = $scope.allMed[index].profile.proMediatorStatusRequested;
    console.log(mid);

    let data = {
      eid: mid  //email
    }
    apicalls.makePro(data, function(res) {
      console.log("Change mediator pro status response");

      if(!res.ok){
        swal({
            title: res.message,
            type: 'error'
            });
      }
      else{
       //$scope.allMed[index].profile.proMediatorStatusApproved = true;
       //or refresh
        $scope.loadMed();
      }

    });
  };

  $scope.revokePro= function(index, mid) {
    //var prostatus = $scope.allMed[index].profile.proMediatorStatusRequested;
    console.log(mid);

    let data = {
      eid: mid  //email
    }
    apicalls.revokePro(data, function(res) {
      console.log("Change mediator pro status response");

      if(!res.ok){
        swal({
            title: res.message,
            type: 'error'
            });
      }
      else{
       //$scope.allMed[index].profile.proMediatorStatusApproved = false;
       //or refresh
        $scope.loadMed();
      }

    });

  };

});

bravAdmin.controller('snippetsCtrl', function($scope,apicalls) {
  console.log('loaded bravAdmin controller');
  //$scope.stuff = {};
  $scope.drafting = true;
  $scope.content='';
  $scope.SnippetTagsArray=[];

  $scope.flipper = function() {
    console.log("flipper",$scope.drafting);
    $scope.drafting = !$scope.drafting;
  };

  $scope.addSnippets = function() {
	  console.log("bravAdmin controller scope.add snippets");

    var data = {
       content:snippet.content,
        tag: $scope.SnippetTagsArray
     // tag: $scope.tag
    };

    console.log("snippets data: ", data);

	  apicalls.addingsnippets(data,function(res) {
      console.log('snippets response received', res);
      alert(res.message);
    });
  };

  $scope.insertSnippetTag = function(sniptag) {
    $scope.errorTag = '';
    console.log("->",sniptag);
    if(!sniptag || sniptag.trim() == '') {
      $scope.errorTag = 'Its a compulsory field!';
      return;
    }

    var doesnotExists = $scope.SnippetTagsArray.indexOf(sniptag) == -1;
    if(doesnotExists) {
        $scope.SnippetTagsArray.push(sniptag);
        $scope.snippet.tags = '';
      }

  };

  $scope.removeTag = function($index) {
    $scope.individual = $scope.SnippetTagsArray.splice($index,1)[0];
  };

  $scope.createSnippet = function(snippet) {
    if(snippet.content && $scope.SnippetTagsArray.length) {

      var data = {
        content:snippet.content,
        tag: $scope.SnippetTagsArray
      };
      $scope.content=snippet.content;
      $scope.tags=$scope.SnippetTagsArray;
      console.log($scope.SnippetTagsArray);
      console.log($scope.content);
      apicalls.createSnippet(data,function(res) {
        console.log(' create snippet-bravadmin.controller.js');
        console.log(' create snippet response ',res);
        if(res.ok) {
          swal({
            title: 'Snippet Created',
            type: 'success'
            });
        }
        else{
          swal({
            title: res.message,
            type: 'error'
          });
        };
      });
    }
    else {
      swal({
          title: 'Please Fill all fields',
          type: 'error'
      });
    }
  };
}) ;

bravAdmin.controller('accountCtrl', function($scope,apicalls){
  $scope.loadProfile = function(){
  apicalls.adminProfile(function(res){
    console.log('Admin Info received', res);
         $scope.user = res;
        console.log($scope.user);
  });
};
});

bravAdmin.controller('orgCtrl', function($scope,apicalls){
  console.log("Bravadmin : orgCtrl");
  $scope.allOrg = [];
  $scope.loadOrg = function(){
    apicalls.getAllOrg(function(res) {
      console.log('Org Info received', res);
         $scope.allOrg = res;
        console.log($scope.allOrg);

   })
  }
});

bravAdmin.controller('indCtrl', function($scope,apicalls){
  console.log("Bravadmin : indCtrl");
  $scope.allInd = [];
  $scope.loadInd = function(){
    apicalls.getAllInd(function(res) {
      console.log('individual Info received', res);
         $scope.allInd = res;
        console.log($scope.allInd);

   })
  }
});

bravAdmin.controller('adminCtrl', function($scope,apicalls){
  console.log("Bravadmin : indCtrl");
  $scope.allAdmin = [];
  $scope.loadAdmin = function(){
    apicalls.getAllAdmin(function(res) {
      console.log('individual Info received', res);
         $scope.allAdmin = res;
        console.log($scope.allAdmin);

   })
  }
});

bravAdmin.controller('boilerplateeditCtrl', function($scope,apicalls,sharedProperties) {

   $scope.tagsArray=[];

  $scope.loadDetails = function(){
  $scope.details=sharedProperties.getDetails();
  $scope.tags=$scope.details.tags;
  $scope.tagsArray=$scope.details.tags;
  console.log("editcontroller: ",$scope.details);
 };

  $scope.insertTag = function(tag,tagsArray) {
    //$scope.errorTag = '';
    console.log("->",tag);
     //c=[];
     $scope.tagsArray = sharedProperties.insertTag(tag,$scope.tagsArray);
      $scope.bplate.tags = '';
      console.log($scope.tagsArray);

  };

  $scope.removeTag = function($index,tags) {
    //$scope.individual = $scope.tags.splice($index,1)[0];
    $scope.tagsArray=sharedProperties.removeTag($index,tags);
  };


});
