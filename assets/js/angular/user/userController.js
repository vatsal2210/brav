angular
  .module('brav')
  .controller('userController', userController);

userController.$inject = ['$rootScope', '$location', 'userService', 'commonService', 'notificationService'];

function userController($rootScope, $location, userService, commonService, notificationService) {
  var USC = this;

  USC.register;
  USC.login;
  USC.registerFrm;
  USC.loginFrm;
  USC.user;
  USC.isLogin = false;

  USC.registerFn = registerFn;
  USC.loginFn = loginFn;
  USC.getProfileFn = getProfileFn;
  USC.nextFn = nextFn;

  function getProfileFn() {
    let user = sessionStorage.getItem('bravUser');
    if (user) {
      userService
        .getSingleUser(JSON.parse(user).id)
        .then(function (res) {
          if (res.success) {
            USC.user = res.data;
          } else {
            notificationService.info(res.msg);
          }
        }, function (err) {

        })
    } else {
      notificationService.error('Please login');
      $location.path('/')
    }
  }

  function loginFn() {
    if (commonService.isEmail(USC.login.username) && USC.login.password) {
      console.log('userservice', userService)
      userService
        .login({
          username: USC.login.username,
          password: USC.login.password
        })
        .then(function (res) {
          if (res.success) {
            USC.loginFrm.$setPristine();
            USC.loginFrm.$setUntouched();
            sessionStorage.setItem('bravUser', JSON.stringify(res.data));
            $location.path('/mediator/' + res.data.id);
          } else {
            notificationService.info(res.msg);
          }
        }, function (err) {

        })
    } else if (!USC.login.password) {
      notificationService.error('Please enter valid password');
    }
  }

  function nextFn() {
    if (USC.login && commonService.isEmail(USC.login.username)) {
      USC.isLogin = true;
    }
  }

  function registerFn() {
    console.log('asdadad')
    if (USC.register && USC.register.firstname && commonService.isEmail(USC.register.username) && USC.register.password && USC.register.repeatpassword) {
      if (USC.register.password !== USC.register.repeatpassword) {
        notificationService.error('Password doesnt match');
        return false;
      }
      commonService
        .formValNotManditory(USC.registerFrm, USC.register)
        .then(function (register) {
          userService
            .register(register)
            .then(function (res) {
              if (res.success) {
                USC.registerFrm.$setPristine();
                USC.registerFrm.$setUntouched();
                $location.path('/');
              } else {
                notificationService.info(res.msg);
              }
            }, function (err) {

            });
        }, function (err) {
          notificationService.error(err.msg);
        })
    } else {
      notificationService.error('Enter all manditory fields')
    }
  }
}
