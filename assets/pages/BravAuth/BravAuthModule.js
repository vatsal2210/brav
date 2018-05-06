let bravAuthModule = angular.module('bravAuthModule',['ngRoute', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial', 'md.data.table'])
.config(function ($routeProvider,$mdThemingProvider) {
  console.log('bravAuthModule Initialized')

/*Available palettes:
red, pink, purple, deep-purple, indigo, blue,
light-blue, cyan, teal, green, light-green, lime,
yellow, amber, orange, deep-orange, brown, grey, blue-grey*/

  /*
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('amber')
      .warnPalette('red')
      .backgroundPalette('grey');
  */

  $mdThemingProvider.definePalette('bravDefaultPalette', {
    '50': '598ebf',
    '100': '598ebf',
    '200': '598ebf',
    '300': '598ebf',
    '400': '598ebf',
    '500': '598ebf',
    '600': '598ebf',
    '700': '598ebf',
    '800': '598ebf',
    '900': '598ebf',
    'A100': '598ebf',
    'A200': '598ebf',
    'A400': '598ebf',
    'A700': '598ebf',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.definePalette('bravWarnPalette', {
    '50': '11aec7',
    '100': '11aec7',
    '200': '11aec7',
    '300': '11aec7',
    '400': '11aec7',
    '500': '11aec7',
    '600': '11aec7',
    '700': '11aec7',
    '800': '11aec7',
    '900': '11aec7',
    'A100': '11aec7',
    'A200': '11aec7',
    'A400': '11aec7',
    'A700': '11aec7',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.definePalette('bravAccentPalette', {
    '50': '37af93',
    '100': '37af93',
    '200': '37af93',
    '300': '37af93',
    '400': '37af93',
    '500': '37af93',
    '600': '37af93',
    '700': '37af93',
    '800': '37af93',
    '900': '37af93',
    'A100': '37af93',
    'A200': '37af93',
    'A400': '37af93',
    'A700': '37af93',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('bravDefaultPalette')
    .warnPalette('bravWarnPalette')
    .accentPalette('bravAccentPalette');

  $routeProvider
    .when("/", { // home page
      templateUrl : 'pages/app.html',
      controller: 'appCtrl'
    });

}); // End of Routes

bravAuthModule.service('tableDefaultOptions',function() {
  this.query = {
    order: '_id',
    limit: 5,
    page: 1
  };

  this.limitOptions = [5, 10, 15];

});

bravAuthModule.service('bravAuthData',function(){
    this.auth = {
      isLoggedIn : false,
      token: '',
      email: null,
      type:0
    };
    console.log('bravAuthData Initialized')

    this.saveAuth = function (token,email,type) {
      this.auth.isLoggedIn = true;
      this.auth.token = token;
      this.auth.email = email;
      this.auth.type = type;
      window.localStorage.setItem('bravAuth',JSON.stringify(this.auth));
    ///  console.log("auth saved "+this.isAuthed()+" \n token = "+this.auth.token);
    };

    this.loadAuthFromLocalStorage = function () {
      if(window.localStorage.getItem('bravAuth')!=null){
        console.log('auth found');
        this.auth = JSON.parse(window.localStorage.getItem('bravAuth'));
        this.auth.isLoggedIn = true;
        console.log('isAuthed : '+this.isAuthed())
      }
      else{
        console.log('auth not found');
        window.location = '/#/login';
      }
      return ()=>{console.log('auth loaded once')}
    };


    this.isAuthed = function () {
      return this.auth.isLoggedIn ;
    };
    this.getType = function () {
      return this.auth.type ;
    };
    this.getEmail = function () {
      return this.auth.email ;
    };
    this.clearAuth = function () {
      this.auth.token = "";
      this.auth.type = 0;
      this.auth.email = null ;
      this.auth.isLoggedIn = false;
      window.localStorage.removeItem('bravAuth');
    };
});

bravAuthModule.service('bravCommunicationHelper',function($http,bravAuthData){
  this.vanilla = function(isPost,api_url,data,next){
      let settings = {
          "async": true,
          "crossDomain": false,
          "url": api_url ,
          "method": "POST",
          "headers": {
              "content-type": "application/x-www-form-urlencoded",
              "cache-control": "no-cache",
              "x-access-token": bravAuthData.auth.token
          }
      };
      if(isPost){
        settings.data = bodyparser(data);
        settings.method = "POST";
      }
      else{
        settings.params = (data);
        settings.method = "GET";
      }
      $http(settings).success(next);
  };
});

bravAuthModule.service('general',function(){
  this.callhumanReadableDate = function(epoch) {
      return humanReadableDate(epoch);
  };
});

bravAuthModule.service('bravUI',function($mdToast){

  this.showSimpleToast = function(text) {
    let pinTo = (function() {
      let last = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };
      let toastPosition = angular.extend({},last);
      let current = toastPosition;
      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;
      last = angular.extend({},current);
      return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
    })();
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .position(pinTo )
        .hideDelay(2000)
    );
  };

  this.showTopToast = function(text) {
    let pinTo = (function() {
      let last = {
        bottom: false,
        top: true,
        left: false,
        right: false
      };
      let toastPosition = angular.extend({},last);
      let current = toastPosition;
      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;
      last = angular.extend({},current);
      return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
    })();
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .position(pinTo)
        .hideDelay(1000)
    );
  };
});

bravAuthModule.service('bravHomeApi',function($http,bravAuthData){

 this.getHome= function (next) {
    console.log("calling /app/home function");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/app/home",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      },
      "data": ""
    }
    $http(settings).success(function (response) {
      console.log(response);
      if(response.ok ){
        next(response);
      }else{
        bravAuthData.clearAuth();
        alert("You have to log in again.");
        window.location = '/#/login';
      }
    });
 };

 this.signout = function () {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/user/signout",
      "method": "GET",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "x-access-token": bravAuthData.auth.token
      }
    }
    $http(settings).success(function (response) {
      if(response.ok){
        bravAuthData.clearAuth();
        window.location = '/#/login';
      }
    });
    bravAuthData.clearAuth();
 };

 var _list =[];
 this.setLinksList = function(l){
  _list = l;
 };
 this.getLinksList= function(){
   return _list ;
 };

});

bravAuthModule.service('tippyApi',function() {
  this.enableTippy = function () {
    /*var tippys = angular.element(document.querySelectorAll('.tippy'));
    console.log(document.body);
    console.log(tippys);
    console.log(document.querySelectorAll('.tippy'));
    console.log(document.querySelector('.tippy'));
    console.log(angular.element(document.querySelectorAll('.tippy')));
    console.log(angular.element(document.querySelector('.tippy')));
    tippys.forEach(function (tippy) {
      new Tippy(tippy);
    });*/
  };
});

bravAuthModule.controller('appCtrl', function($scope,bravHomeApi) {
  $scope.obj  = {};
  $scope.heading ="";
  $scope.article =[];
  $scope.sample  = "hello sample string";
  bravHomeApi.getHome(function(res){
      $scope.heading = res.data.headline ;
      $scope.article = res.data.article ;
    });
});

bravAuthModule.controller('indexCtrl', function($scope,bravAuthData,bravHomeApi,$mdSidenav,tableDefaultOptions){

  $scope.tableDefaultOptions = tableDefaultOptions;

  $scope.callOpenSideNavFromParent = function(link) {
    $scope.openSideNav(link);
  };

  $scope.openSideNav = function(link) {
    if(link.href)
      $scope.toggleSideNav();
    link.open = !link.open;
  };

  $scope.links =[];
  $scope.showText = false;
  $scope.outOfNav = true;

  $scope.loadSideBarLinks = function(){
    //console.log('calling loadSideBarLinks Links loading')
    $scope.links = bravHomeApi.getLinksList();
  };

  $scope.toggleSideNav = function() {
    //console.log("toggleSideNav");
    $mdSidenav('left').toggle();
  };

  $scope.mouseOutToggleSidebarText = function(link) {
    link.open = false;
    $scope.toggleSidebarText();
  };

  $scope.inOrOutofNav = function(inOrOut) {
    $scope.outOfNav = inOrOut;
    if(inOrOut)
      $scope.showText = true;
    else $scope.showText = false;
  };

  $scope.toggleChatNav = function() {
      $mdSidenav('right').toggle();
  };

  $scope.isChatOpen = function() {
     return $mdSidenav('right').isOpen();
  };

  $scope.onload = function () {
     console.log("called onload");
     bravAuthData.loadAuthFromLocalStorage();
     if (!bravAuthData.isAuthed()){
       console.log('nav away')
     //   window.location = '/#/login';
        $scope.appswitch.isLoggedIn = false;
        $scope.appswitch.type = 0;
     }
     else{
       $scope.appswitch.isLoggedIn = true ;
       $scope.appswitch.type = bravAuthData.getType();
     }
   }
   $scope.logout = function () {
    bravHomeApi.signout();
    $scope.appswitch.isLoggedIn = false ;
    $scope.appswitch.type = 0 ;
  };

  $scope.appswitch = {
    isLoggedIn :false,
    type:0
  };


  $scope.reloadCurrentPageBtnShow = true ;
  $scope.showChatIcon = false;
  $scope.reloadCurrentPage = function(){
    console.log('refreshing now')
    let loc = window.location.hash;
    window.location = loc+'refresh';
    window.location = loc;
  }
  $scope.willShowChatIcon = function() {
      var hash = location.hash;
      if(hash == "#/ms/currentsession" || hash.substr(0,6) == "#/ms/s" )
        {
          $scope.showChatIcon = true;
          $scope.reloadCurrentPageBtnShow = false;
        }
      else
        {
          $scope.showChatIcon = false;
          $scope.reloadCurrentPageBtnShow = true;
          //$scope.$digest();
        }
  };
  $scope.willShowChatIcon(); // call initially

  window.onhashchange_array = [];
  window.onhashchange_array.push(function(){
      console.log('INDEXCTRL: hash change')
      $scope.willShowChatIcon();
  });
  window.lastHash = '#/';
  window.onhashchange = function(){
    window.onhashchange_array.forEach(f=>{
      f();
    });
    window.lastHash = window.location.hash;
  }

    $scope.isfullScreen = false;
    document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    function exitFullscreen() {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      }
      else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
      }
      else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      }
    }

  $scope.toggleFullScreen = function(){
      if(!$scope.isfullScreen)
        requestFullscreen(document.documentElement);
      else exitFullscreen();
      $scope.isfullScreen = !$scope.isfullScreen;
  }

});


