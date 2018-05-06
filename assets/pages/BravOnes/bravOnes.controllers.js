bravOnes.controller('accountMCtrl', function ($scope, mApi, bravUI) {
  $scope.tzs = [
    { name: 'US Pacific UTC-08:00', value: 'PST', offset: 480 },
    { name: 'US Mountain Time UTC-07:00', value: 'MT', offset: 420 },
    { name: 'US Central UTC-06:00', value: 'CST', offset: 360 },
    { name: 'US East UTC-05:00', value: 'EST', offset: 300 },
    { name: 'Eu GMT UTC+00:00', value: 'GMT', offset: 0 },
    { name: 'Eu Central ET UTC+01:00', value: 'CET', offset: -60 },
    { name: 'Eu Eastern ET UTC+02:00', value: 'EET', offset: -120 },
    { name: 'South Africa UTC+04:00', value: 'SAST', offset: -120 },
    { name: 'Eu Moscow MSK UTC+03:00', value: 'MSK', offset: -180 },
    { name: 'Gulf GST UTC+04:00', value: 'GST', offset: -240 },
    { name: 'India IST UTC+05:30', value: 'IST', offset: -330 },
    { name: 'Aus AWST UTC+08:00', value: 'AWST', offset: -480 },
    { name: 'Japan JST UTC+09:00', value: 'JST', offset: -540 },
    { name: 'Aus ACST UTC+09:30', value: 'AWCT', offset: -570 },
    { name: 'NZ NZST UTC+12:00', value: 'NZST', offset: -720 },
  ];
  $scope.currencies = [
    { name: 'United States Dollar, USD', code: 'USD' },
    { name: 'British Pound, GBP', code: 'GBP' },
    { name: 'Euro, EUR', code: 'EUR' },
  ]
  $scope.user = {};
  $scope.drafting = true;

  $scope.flipper = function () {
    $scope.drafting = !$scope.drafting;
  };

  $scope.toggle = function (el) {
    el = !el;
  }

  mApi.getProfile(function (response) {
    if (response.ok) {
      $scope.user = response.profile;
      //$scope.tz = response.tz;
      $scope.name = response.name;
      $scope.email = response.email;
      if (!!$scope.user.profile) {
        if (!!$scope.user.profile.rate) {
          $scope.user.profile.rate = $scope.user.profile.rate / 100;
        } if (!$scope.user.profile.currency) {
          $scope.user.profile.currency = "USD";
        }
        if (!$scope.user.profile.specialities) {
          $scope.user.profile.specialities = [];
        }
      }
      else {
        $scope.user.profile = {};
        $scope.user.profile.specialities = [];
      }
    }
  });


  $scope.saveChanges = function () {
    if ($scope.user.profile.specialities.length == 0) {
      bravUI.showSimpleToast('Enter speciality & press `Enter`');
      return;
    }
    var objtosend = {
      name: $scope.user.name,
      tz: $scope.user.tz,
      profile: $scope.user.profile,
    };
    mApi.saveProfile(objtosend, function (response) {
      console.log('saveProfile res ', response)
      if (response.ok) {
        $scope.flipper();
      }
    });

  };

});

bravOnes.controller('ManageCompanyCtrl', function ($scope, mApi, CompanyProfileProperties) {
  console.log('loaded bravOnes manage company controller');
  $scope.regNat = /^[a-zA-Z\s]*$/;
  $scope.inttel = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

  $scope.thisAgreementStuff = {
    involvedParties: []
    //readOnly :false,
    //editable:true,
    //finalized:false,
  };

  $scope.involvedPartyEmail = '';

  $scope.insertIndividual = function () {
    let individual = $scope.involvedPartyEmail;
    $scope.errorIndividual = '';
    console.log("email: ", $scope.involvedPartyEmail);
    /*  if(!individual || individual.trim() == '') {
         $scope.errorIndividual = 'Please enter a Email Address';
         return;
       }*/

    if (!validateEmail(individual)) {
      $scope.errorIndividual = 'Please enter a Valid Email Address';
      return;
    }
    console.log($scope.thisAgreementStuff)
    console.log($scope.thisAgreementStuff.involvedParties)
    var doesnotExists = $scope.thisAgreementStuff.involvedParties.indexOf(individual) == -1;
    if (doesnotExists) {
      console.log("Email now:", individual);
      mApi.checkMemberValidity(individual, function (res) {
        if (res.ok) {
          console.log("Valid email");
          $scope.thisAgreementStuff.involvedParties.push(individual);
          $scope.involvedPartyEmail = '';
        }
        else {
          console.log("Invalid email");
          $scope.errorIndividual = res.message;
          return;
        }
      });
    }
    console.log("emailArray: ", $scope.thisAgreementStuff.involvedParties)
  };

  $scope.removeIndividual = function ($index) {
    $scope.thisAgreementStuff.involvedParties.splice($index, 1)[0];
  };

  /* $scope.loadorglist = function(){
      console.log('inside load load org list function')
      mApi.getAllOrgList(function(res) {
        console.log('list Info received', res);
           $scope.allMorg= res;
          console.log($scope.allMorg);
  
     });
    };*/

  $scope.viewCompany = function (name) {
    console.log('inside viewCompany function')
    console.log('Company: ', name);
    mApi.getCompProfile(name, function (res) {
      console.log('list Info received', res);
      if (res.ok) {
        console.log("bravOnescontroller: ", res.request);
        CompanyProfileProperties.setDetails(res.data);
        window.location = "#/mc/compProfile";
      }
    });

  };

  $scope.createCompany = function () {
    console.log('inside create company function');
    if ($scope.companyname && $scope.contact) {
      var data = {
        Name: $scope.companyname,
        phone: $scope.contact,
        involvedParties: $scope.thisAgreementStuff.involvedParties,
        country: $scope.nationality,
        orgEmail: $scope.orgEmail,
        Address: $scope.caddress,
        currency: $scope.currency

      };
      console.log("name: ", $scope.companyname);
      console.log("contact: ", $scope.contact);
      console.log("array: ", $scope.thisAgreementStuff.involvedParties);
      console.log("country", $scope.country);
      console.log("orgEmail:", $scope.orgEmail);
      console.log("Address:", $scope.caddress);
      console.log("currency:", $scope.currency);

      console.log("var data: ", data);
      mApi.createCompany(data, function (res) {
        console.log(' create  response ', res)
        if (res.ok) {
          swal({
            title: 'Company Created',
            type: 'success'
          });
        } else {
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

  $scope.loadmyorglist = function () {
    console.log('inside load my org list function')
    mApi.getMyOrgList(function (res) {
      console.log('list Info received', res);
      $scope.acceptedList = res.myCom;
      $scope.pendingList = res.pending;
      console.log($scope.acceptedList);

    });
  };



});

bravOnes.controller('CompanyDataCtrl', function ($scope, mApi, CompanyProfileProperties) {

  $scope.loadCompanyProfile = function () {
    $scope.comp = CompanyProfileProperties.getDetails();
    console.log("details: ", $scope.comp);
    if (isEmpty($scope.comp)) {
      location.replace("/application#/mc/view");
    }
  };

  $scope.joinCompany = function () {

    console.log("Requesting to Join!");
    /* mApi.joinCompanyRequest(function(res) {
       console.log('isMember set:', res.members.isMember);
         $scope.comp.creator.flag=res.members.isMember;
         console.log("creator flag: ",$scope.comp.creator.flag);
         if($scope.comp.creator.flag) // this is temporary, swal can be added later after response
           console.log("Successfully Joined the Group");
         else
            console.log("Couldn't join the group the Group");
 
    });*/
  };

});

bravOnes.controller('MyOrgCtrl', function ($scope, mApi, CompanyProfileProperties) {

  $scope.loadmyorglist = function () {
    console.log('inside load my org list function')
    mApi.getMyOrgList(function (res) {
      console.log('list Info received', res);
      $scope.acceptedList = res.myCom;
      $scope.pendingList = res.pending;
      console.log($scope.acceptedList);

    });
  };

  $scope.viewCompany = function (name) {
    console.log('inside viewCompany function')
    console.log('Company: ', name);
    mApi.getCompProfile(name, function (res) {
      console.log('list Info received', res);
      if (res.ok) {
        console.log("bravOnescontroller: ", res.request);
        CompanyProfileProperties.setDetails(res.data);
        window.location = "#/mc/compProfile";
      }
    });

  };

});
