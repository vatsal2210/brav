agreementApp.controller('agreementCreateCtrl', function($scope,agreementsApi,$mdToast,$mdDialog,bravUI) {

  $scope.showConfirm = function(ev,titleName,text,aria,selectedBoilerplate) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title(titleName)
          .textContent(text)
          .ariaLabel(aria)
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

    $mdDialog.show(confirm).then(function() {
      console.log("yes");
      $scope.getBoilerPlateData(selectedBoilerplate);
    }, function() {
      console.log("no");
    });
  };

  $scope.getBoilerPlateData = function(selectedBoilerplate) {
      $scope.content= '"' + selectedBoilerplate + '" is Loading..';
      // do make api call to fetch the boilerplate
      var selectedId ='';
      $scope.helperStuff.boilerplates.forEach(function(e){
        if(e.name == selectedBoilerplate){
          selectedId = e._id;
        }
      });
      console.log($scope.content);
      console.log('selectedId : ' ,selectedId)
      agreementsApi.getBoilerPlate(selectedId,function(response){
          console.log('agreements api response came ',response);
          if(response.ok){
            bravUI.showSimpleToast('Boilerplate Added');
            $scope.content= response.plate.content ;
            angular.element(document.querySelector('[id^="trix-input-"]'))[0].previousElementSibling.value = $scope.content;
          }
      });
  };

  $scope.validateChip = function(chip) {
    console.log(chip,validateEmail(chip));
      if(validateEmail(chip))
          return undefined;
        else return null;
  };

  $scope.wholeNewScope = function() {
    $scope.thisAgreementStuff = {
      involvedParties :[],
      readOnly :false,
      editable:true,
      finalized:false,
    };
    $scope.content = '';
    $scope.dynamics ={
      drafting : false,
    }
    $scope.bufferStuff ={
      involvedPartyEmail : '',
    }
    $scope.helperStuff = {
      boilerplates : [],
      selectedBoilerplate :'',
      showConfirm:false,
      snippets :[],
      selectedSnippet :'',
      checklist:[],
      isFresh: true
    }
    console.log('initialized whole new scope for agreements creator')
  };

  $scope.wholeNewScope();

  $scope.initFreshAgreement = function(){
    $scope.dynamics.drafting = false ;
    agreementsApi.getHelperData(function(res) {
      if(res.ok) {
        if(res.checklist)
        $scope.helperStuff.checklist = res.checklist.map(function(itemToCheck){
          return{item:itemToCheck,checked:false}

        });
        $scope.helperStuff.snippets = res.snippets;
        $scope.helperStuff.boilerplates = res.boilerplates;
      }
    });
    $scope.content =
      `
        <h1 class="f1 fw2 black-50 ma0"> Agreement Title </h1>
        <p>Please Edit and write your agreement here.</p>
        <p>You can choose from the boilerplates to replace the whole
            content and also use snippets for copying general clauses. </p>
      `;
  }
      // To see if this activity is loaded to edit an old agreement
    let doWeHaveSomethingToEdit = agreementsApi.getAgreementStuff();
    $scope.initFreshAgreement();
    if(doWeHaveSomethingToEdit)
    /*** OLD AGREEMENT TO CONTINUE DRAFTING */
    {
      $scope.thisAgreementStuff = doWeHaveSomethingToEdit ;
      $scope.helperStuff.isFresh = false;
      $scope.dynamics.drafting = true;
      if($scope.thisAgreementStuff.checklist)
      {
            console.log('checklist thisAgreementStuff ',$scope.thisAgreementStuff.checklist);
            /*
            $scope.helperStuff.checklist = $scope.thisAgreementStuff.checklist.map(function(item){
              item.checked = (item.checked=="true");
              return item;
            }) || ;
            */
      }
      console.log('checklist Scope ',$scope.helperStuff.checklist);
      //$scope.$digest();
      $scope.content = $scope.thisAgreementStuff.content ||  $scope.content ;
    }
    else
    /*** FRESH NEW AGREEMENT ***/
    {
      // nothing needs to be done as of now
    }

  $scope.flipper = function() {
    console.log("flipper changed : ",$scope.dynamics.drafting);
    if(!$scope.thisAgreementStuff.involvedParties.length) {
        bravUI.showSimpleToast('Enter email of other parties & press `Enter`');
    }
    else $scope.dynamics.drafting = !$scope.dynamics.drafting;
  };

  /***** Utility functions *****/

  $scope.matchSnippet = function (input) {
    var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
      return $scope.helperStuff.snippets.filter(function(snippet) {
          if(snippet.text.match(reg)) {
            return snippet;
          }
      });
  };

  $scope.matchBoilerplate = function (input) {
    var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
    return $scope.helperStuff.boilerplates.filter(function(boilerplate) {
      if (boilerplate.name.match(reg)) {
        return boilerplate.name;
        }
      });
  }

  // Dynamics of content
  $scope.saveAgreement = function() {
    var data = {
      id: $scope.thisAgreementStuff._id,
      content: $scope.content,
      checklist: $scope.helperStuff.checklist
    };
    agreementsApi.saveModifiedContent(data,function(res) {
      if(res.ok) {
        console.log("yay savedModifiedContent");
        bravUI.showSimpleToast('Agreement Saved');
      }
    });
  };

  $scope.lastSaved = function() {
    console.log($scope.thisAgreementStuff._id);
    agreementsApi.getLastSaved($scope.thisAgreementStuff._id,function(res) {
      console.log('response of getlastSaved ',res);
      if(res.ok) {
        $scope.content = res.stuff.content || $scope.content;
        angular.element(document.querySelector('[id^="trix-input-"]'))[0].previousElementSibling.value = $scope.content;
        /*
        $scope.helperStuff.checklist = res.stuff.checklist.map(function(item){
          item.checked = item.checked=="true";
          return item;
        }) || $scope.helperStuff.checklist;
        */
      }
    });
  };

   $scope.trixChange = function(e, editor) { // required for Saving Agreement
      $scope.content = e.target.value;
   };

  $scope.cancel = function() { // cancelling dialog
    console.log("cancel");
    $mdDialog.cancel();
  };

  $scope.finalize = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'pages/Agreement/html/checklist.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      scope: $scope.$new(),
      clickOutsideToClose:true
    })
    .then(function() {
      console.log("submitted");
      $scope.allChecked = true;
      $scope.helperStuff.checklist.forEach(function(item){
        if(!item.checked){
          $scope.allChecked = false;
        }
      });
      if($scope.allChecked) {
        var data = {
          id: $scope.thisAgreementStuff._id,
          content: $scope.content,
          checklist: $scope.helperStuff.checklist
        };
        agreementsApi.saveModifiedContent(data,function(res) {
          if(res.ok) {
            console.log("Saved agreement");
            agreementsApi.finalize($scope.thisAgreementStuff._id,function(res) {
              if(res.ok) {
                $scope.thisAgreementStuff.content = data.content;
                $scope.thisAgreementStuff.editable = false;
                $scope.thisAgreementStuff.finalized = true;
                $scope.thisAgreementStuff.accessType = 3;
                agreementsApi.setAgreementStuff($scope.thisAgreementStuff);
                bravUI.showSimpleToast('Successfully Finalized the Agreement');
                window.location = "#/agreements/read";
              }
            });
          }else{
            bravUI.showSimpleToast('Error in saving the agreement');
          }
        });
      }
      else {
        bravUI.showSimpleToast('Make sure you check all the Checklist');
      }
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });

  };

  function DialogController($scope, $mdDialog) {
    $scope.submit = function() {
      $mdDialog.hide();
    };
  }

  $scope.discardNonFinalAgreement = function() {
    agreementsApi.discardNonFinalAgreement($scope.thisAgreementStuff._id,function(res) {
      if(res.ok){
        window.location = '#/agreements/new';
        bravUI.showSimpleToast('Agreement Discarded');
        $scope.wholeNewScope();
      }
    });
  };

  $scope.createAgreement = function() {
    if($scope.thisAgreementStuff.title && $scope.thisAgreementStuff.description &&
        $scope.thisAgreementStuff.description.length) {
        if(!$scope.thisAgreementStuff.involvedParties.length) {
            bravUI.showSimpleToast('Enter email of other parties & press `Enter`');
        }
        else {
          var data = {
              title:$scope.thisAgreementStuff.title,
              description:$scope.thisAgreementStuff.description,
              involvedParties: $scope.thisAgreementStuff.involvedParties
            };
            agreementsApi.createAgreement(data,function(res) {
              console.log(' create agreement response ',res)
              if(res.ok) {
                $scope.helperStuff.isFresh = false;
                $scope.thisAgreementStuff._id = res.agreementDetailsObject._id;
                bravUI.showSimpleToast('Agreement Created');
              }else{
                bravUI.showSimpleToast('Some Error Occurred');
              };
            });
        }
    }
    else {
      bravUI.showSimpleToast('Please Fill all fields');
    }
  };

  $scope.editAgreement = function(agreement) {
    if(!$scope.thisAgreementStuff.involvedParties.length) {
        bravUI.showSimpleToast('Enter email of other parties & press `Enter`');
    }
    else agreementsApi.updateAgreement($scope.thisAgreementStuff._id,$scope.thisAgreementStuff,function(res) {
      console.log('Edit agreement response ',res)
      if(res.ok) {
        console.log("ok agreement edited");
        bravUI.showSimpleToast('Details Saved !!');
      }
    });
  };
});
