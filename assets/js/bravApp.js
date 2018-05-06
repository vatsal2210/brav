/**
 * Created by Omkar Dusane on 12-Oct-16.
 */
/*Available palettes:
red, pink, purple, deep-purple, indigo, blue,
light-blue, cyan, teal, green, light-green, lime,
yellow, amber, orange, deep-orange, brown, grey, blue-grey*/

var app = angular.module('bravApp', [ 'ngRoute', 'ngAria', 'ngAnimate', 'ngMessages', 'ngMaterial']);

app.config(function($routeProvider,$mdThemingProvider) {

/*  $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('indigo')
      .warnPalette('red')
      .backgroundPalette('grey');
*/

    $mdThemingProvider.definePalette('bravPalette', {
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
    $mdThemingProvider.theme('default')
      .primaryPalette('bravPalette')

  $routeProvider
    .when("/login", {
      templateUrl : 'pages/login/login.html',
      controller  : 'authCtrl'
    })
    .when("/reg", {
      templateUrl : 'pages/login/reg.html',
      controller  : 'regAuthCtrl'
    })
    .when("/reset", {
      templateUrl : 'pages/login/reset.html',
      controller  : 'resetCtrl'
    });

});

//app.controller('authCtrl', ['bravAuthData',authCtrl]);
app.controller('authCtrl', authCtrl);
app.controller('regAuthCtrl', regAuthCtrl);
// app.controller('appCtrl', appCtrl);
app.controller('indexCtrl', indexCtrl);

app.controller('sidebar', function($scope) {
  $scope.links = [{
    title:'Profile',
    nest:true,
    sub:[{
        title:'View',
        href:'#/m/profile/view'
      },
      {
        title:'Edit',
        href:'#/m/profile/edit'
      }
    ]
  },
  {
    title:'Mediation Session',
    href: "#/m/session",
    nest:false
  }
  ];
});

function indexCtrl($scope,$rootScope,$http) {
  LoginAPICaller.setHttp($http);
  $scope.activeSidebar = false;
  $scope.bar = {show:true,v:true,a:true} ;
  $scope.seshInfo = {sesh:{title:'',note:''},tz:'',timeslot:'',dateslot:''};

  $scope.pushMainOff = function() {
    var mainView = document.querySelector('.mainView');
    mainView.style.paddingLeft = $scope.activeSidebar ? '300px' : '0';
  }

  $scope.sidebarLoaded = function() {
    var aside = document.querySelector('aside');
    var height;
    if(aside.scrollHeight)
      height = aside.scrollHeight;
    else height = window.innerHeight - aside.offsetTop;
    aside.style.height = height + "px";
  }

  $scope.toggleSidebar = function() {
    $scope.activeSidebar = !$scope.activeSidebar;
    $scope.pushMainOff();
  };

  $scope.openNestedLevel = function($event) {
    $event.preventDefault();
    $event.target.nextElementSibling.classList.toggle('open-level');
    $scope.sidebarLoaded();
  };

  $scope.openPowerButton = function($event) {
    $event.preventDefault();
    var viewNavbarOptions = $event.target.nextElementSibling.style.display;
    $event.target.nextElementSibling.style.display = viewNavbarOptions === '' ? 'block' : '';
  }

  $scope.applySidebarClass = function($event) {
    $event.target.classList.toggle('brav-nav-color');
  }

  $scope.closeChatClicked = function () {
    window.location= '/';
  };

  $scope.barChatClickedV = function (v) {
    $scope.bar.v = v ;
    console.log('emmiting '+$scope.bar)
    $rootScope.$emit('vidstate',$scope.bar);
  };
  $scope.barChatClickedA = function (a) {
    $scope.bar.a = a ;
    console.log('emmiting '+$scope.bar)
    $rootScope.$emit('vidstate',$scope.bar);
  };

  $scope.appswitch = {
    isLoggedIn :false,
    type:0
  };

  $scope.onload = function () {
     console.log("called onload",bravAuthData.isAuthed());
     if (!bravAuthData.isAuthed())
     {
        console.log('Calling login');
        window.location = '/#/login';
        $scope.appswitch.isLoggedIn = false;
        $scope.appswitch.type = 0;
     }
     else
     {
       console.log('AuthToken',bravAuthData.auth.token)
       apploader(bravAuthData.auth.token);
     }
   }

   $rootScope.$on('loggedIn',function (event, data) {

   });

  $scope.logout = function () {
    LoginAPICaller.signout();
    $scope.appswitch.isLoggedIn = false ;
    $scope.appswitch.type = 0 ;
  };
}

var bravAuthData = (function() {
    this.auth = {
      isLoggedIn : false,
      token: '',
      email: null,
      type:0
    };

    this.loadAuthFromLocalStorage = function () {
      if(window.localStorage.getItem('bravAuth')!=null){
        this.auth = JSON.parse(window.localStorage.getItem('bravAuth'));
      }
      else{
        console.log('not found');
      }
    };

    this.loadAuthFromLocalStorage();

    this.isAuthed = function () {
      return this.auth.isLoggedIn ;
    };

    this.getType = function () {
      return this.auth.type ;
    };
    this.getEmail = function () {
      return this.auth.email ;
    };

    this.saveAuth = function (token,email,type) {
      this.auth.isLoggedIn = true;
      this.auth.token = token;
      this.auth.email = email;
      this.auth.type = type;
      window.localStorage.setItem('bravAuth',JSON.stringify(this.auth));
    ///  console.log("auth saved "+this.isAuthed()+" \n token = "+this.auth.token);
    };

    this.clearAuth = function () {
      this.auth.token = "";
      this.auth.type = 0;
      this.auth.email = null ;
      this.auth.isLoggedIn = false;
      window.localStorage.removeItem('bravAuth',JSON.stringify(this.auth));
    };

    return this;

})();


var LoginAPICaller = {

  setHttp : function (http) {
     LoginAPICaller.http = http ;
  },

  signup : function(user,next){
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/user/signup",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
      },
      "data": bodyparser( {
        "name":user.name,
        "email":user.email,
        "pw":user.pw,
        "type":user.type,
        "agree":user.agree,
      })
    };
    LoginAPICaller.http(settings).success(next);
  },

  verify : function (user,next) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/user/verify",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data": bodyparser({
        "email": user.email,
        "otp": user.otp
      })
    };
    LoginAPICaller.http(settings).success(function (response) {
      console.log(response);
      if(response.ok ){
        LoginAPICaller.signin(user,response=>{
          console.log(" authtokn = ")
          console.log(response)
          apploader(response.token );
        });
        next();
      }else{
        alert("Wrong Otp.")
      }
    });
  },

  forgotPassword : function (user,next) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/user/recover/getotp",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data":  bodyparser( {
        "email":user.email,
        "pw":user.pw
      })
    }
    LoginAPICaller.http(settings).success(function (response) {
      if(response.ok){
        next();
      }else{
        alert("Email does not exist. Check email again");
        window.location = '/#/login';
      }
    });
  },

  verifyAfterPasswordRecovery: function (user,next) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/user/recover/verify",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data":  bodyparser( {
        "email":user.email,
        "otp": user.otp
      })
    }

    LoginAPICaller.http(settings).success(function (response) {
    if(response.ok){
      bravAuthData.saveAuth(response.token,response.email,response.type);
      LoginAPICaller.signin(user,response=>{
        console.log(" authtokn = ")
        console.log(response)
        apploader(response.token );
    });
    }else{
      alert("Wrong id and password.");
      bravAuthData.clearAuth();
      window.location = '/#/login';
    }
    });
  },

  signin : function (user,next) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/user/signin",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data": bodyparser(user)
    }
    LoginAPICaller.http(settings).success(function (response) {
    if(response.ok){
      bravAuthData.saveAuth(response.token,response.email,response.type);
      // window.location = '/#/app';
      next(response);
    }else{
      alert("Wrong id and password.");
      bravAuthData.clearAuth();
      window.location = '/#/login';
    }
   });

  },

  signout : function () {
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
    LoginAPICaller.http(settings).success(function (response) {
    if(response.ok){
      bravAuthData.clearAuth();
      window.location = '/#/login';
    }
    });
  },

};

let toastNow = function($mdToast , text){
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

function authCtrl($scope,$http,$mdToast){
  LoginAPICaller.setHttp($http);
  $scope.showForm = 0;
  $scope.isLoggedIn = function(){
      if(!bravAuthData.isAuthed()){
        window.location = '/#/login';
        return false;
      } else{

        return true;
      }
  };

  $scope.sendOTP = function() {
    if(!$scope.user1.email )
    {
      toastNow($mdToast,"Please enter your email in the form then submit.");
    }else
    if(!$scope.user1.pw )
    {
      toastNow($mdToast,"Please enter a new password and then submit.");
    }else
    {
      LoginAPICaller.forgotPassword($scope.user1, function() {
        $scope.showForm = 2;
      });
    }
  };

  $scope.verifyOTP = function() {
    if(!$scope.user1.otp )
    {
      toastNow($mdToast,"Please enter the otp and then submit.");
    }else{
      LoginAPICaller.verifyAfterPasswordRecovery($scope.user1, function() {
        $scope.login($scope.user1);
      });
    }
  };

  $scope.forgotPass = function(){
    $scope.showForm = 1;
  };

  $scope.goBackAt = function(num){
    $scope.showForm = num;
  };

  $scope.login = function (user) {
    if(user)
    if(!user.email )
    {
      toastNow($mdToast,"Please enter a valid email.");
    }else
    if(!user.pw )
    {
      toastNow($mdToast,"Please enter the password.");
    }else{
      LoginAPICaller.signin(user,(response)=>{
          apploader(response.token);
      });
    }
  }

}

function apploader(token){
  var input = document.createElement('input');
  input['name'] = 'auth' ;
  input['value'] = token ;
  input.setAttribute('type','hidden');
  document.getElementById('apploader').innerHTML ='';
  document.getElementById('apploader').appendChild(input);
  document.getElementById('apploader').submit()
}

function regAuthCtrl($scope,$http,$mdToast) {
  LoginAPICaller.setHttp($http);
  $scope.obj  = {};
  $scope.sample  = "hello sample string";
  $scope.showWhich = 0;
  $scope.user ={type:'Individual',agree:false};
  
  $scope.submit1 = function(){
    if(!$scope.user.name )
    {
      toastNow($mdToast,"Please enter a name in the form");
    }else
    if(!$scope.user.type )
    {
      toastNow($mdToast,"Please Select a type in the form");
    }else
    if(!$scope.user.email )
    {
      toastNow($mdToast,"Please enter a valid email in the form");
    }else
    if(!$scope.user.pw )
    {
      toastNow($mdToast,"Please choose a password and put in the form");
    }else{
      $scope.showWhich = 1;
      LoginAPICaller.signup($scope.user,function(res) {
        $scope.pw = '' ;
        if(res.ok){
          toastNow($mdToast,"Please find the OTP in your email inbox of : "+$scope.user.email);
        }else{
          $scope.showWhich = 0;
          toastNow($mdToast,'Issue: '+res.message );
        }
      });
    }
  };
  $scope.submit2 = function(){
    if(!$scope.user.otp )
    {
      toastNow($mdToast,"Please enter the OTP sent to your email.");
    }else{
      LoginAPICaller.verify($scope.user,function(){
        $scope.showForm = 2;
      });
    }
  };

  $scope.submit0 = function(){
    $scope.showWhich = 0;
  };
}

app.controller('resetCtrl',function($scope){
  console.log('loaded reset controller');
  bravAuthData.clearAuth();
  window.location = '/#/login';
});
