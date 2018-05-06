//var sessionsRequestCtrl ;
caseServices.controller('sessionsRequestCtrl', function ($scope, msApi, $mdDialog, bravUI
  ,easyPay
) {
  /***
   *  States of thie page
   *  
   *  MED :M1: Discount Accept Reject 
   *  MED :M2: Discount [Accepted/Rejected] 
   *  MED :M3: Schedule Join 
   *  MED :M4: Re-Schedule Join 
   *
   ***********************************
   *  IN :I0: Awaiting Accept Reject
   *  IN :I1: Pay Redeem Accept Reject
   *  IN :I2: Pay Redeem [Accepted/Rejected]
   *  IN :I3: Schedule [Accepted/Rejected] Join
   *  IN :I4: Re-Schedule [Accepted/Rejected] Join
   *
   *********************************** 
   *  ORG :O0: Awaiting 
   *  ORG :O1: Pay Redeem
   *  ORG :O2: Schedule Join
   *
   ***********************************
   *  ALL :A1: Ended.
   *  ALL :A2: Cancelled. // all mediators rejected
   *   
  ***/

  console.log('_---------------Loading Now')

  $scope.isMediator = msApi.isMediator();
  $scope.isOrg = msApi.isOrg();
  $scope.isIndividual = (!$scope.isMediator && !$scope.isOrg);
  $scope.buttons = {
    awaiting: true,
    responded: false,
    pay: false,
    join: false,
    ended: false,
    cancelled: false,
  };
  $scope.sessionDetails = {};

  let load = () => {
    console.log('Loading Now')
    msApi.getOneMediationSessionRequest(function (response) {
      console.log('Sessions request loaded : ', response);
      if (response.ok) {
        $scope.sessionDetails = response.session.sessionObject;
        $scope.sessionDetails.id = response.session._id;
        $scope.sessionDetails.createdAt = humanReadableDate(response.session.createdAt);//dummy field
        $scope.sessionDetails.payment = '' + (response.session.costs.total / 100) + ' '+response.session.costs.currency;//dummy field       
        $scope.sessionDetails.payable = '' + (response.session.costs.payable / 100) + ' '+response.session.costs.currency;//dummy field       
        $scope.sessionDetails.payableCurrency =  response.session.costs.payableCurrency  ;//dummy field       
        $scope.sessionDetails.individuals = response.session.individuals;
        $scope.sessionDetails.mediators = response.session.mediators;
        $scope.sessionDetails.schedule = response.session.schedule;
        if (response.session.schedule) {
          $scope.sessionDetails.schedule.str = new Date(response.session.schedule.epoch).toString();
          $scope.sessionDetails.schedule.future = (new Date().getTime() < response.session.schedule.epoch);
          $scope.sessionDetails.schedule.fromNow = moment(new Date(response.session.schedule.epoch), "YYYYMMDD").fromNow();
        }
        $scope.flags = {
          session: response.session.sessionStatus,
          payment: response.session.payment.status,
        };
        $scope.sessionDetails.status = 'Session Started';

        let atLeastOneMediatorReady = false;
        let allMediatorRejectedCount = 0;
        response.session.mediators.forEach(medi => {
          if (medi)
            if (medi.responded) {
              if (medi.accepted) {
                atLeastOneMediatorReady = true;
                $scope.buttons.pay = true;
              } else {
                allMediatorRejectedCount++;
              }
            }
        });
        if (!atLeastOneMediatorReady) {
          if (allMediatorRejectedCount == response.session.mediators.length) {
            $scope.buttons.cancelled = true;
          }
        }
        if ($scope.isMediator) { // MEDIATOR 
          $scope.myProfile = response.session.mediators.find(medi => {
            return medi.email == msApi.myEmail();
          });
        } else {
          $scope.myProfile = response.session.individuals.find(indi => {
            return indi.email == msApi.myEmail();
          });
        }
        if ($scope.myProfile) {
          $scope.buttons.responded = $scope.myProfile.responded
        }
        /*if(atLeastOneMediatorReady){
          if($scope.myProfile.responded){
            
          }
        }*/
        if ($scope.flags.payment == 31) {
          // dont show anything about poy
          $scope.buttons.pay = false;
          $scope.buttons.join = false;
          $scope.buttons.schedule = false;
          $scope.sessionDetails.status = 'Payment Initiated.';
        }
        else if ($scope.flags.payment > 32) {
          // join dakhwa
          $scope.buttons.pay = false;
          $scope.buttons.join = true;
          $scope.buttons.schedule = true;
          $scope.sessionDetails.status = 'Payment Successful.';
          if ($scope.flags.payment == 34) {
            $scope.sessionDetails.status = 'Payment is skipped.';
          }
        }
        else if ($scope.flags.payment < 31) {
          // show pay
          $scope.buttons.pay = true;
          $scope.buttons.join = false;
          $scope.buttons.schedule = false;
          $scope.sessionDetails.status = 'Please pay to confirm session';
          if ($scope.isMediator)
            $scope.sessionDetails.status = 'Awaiting payment from the involved parties';
          if (!atLeastOneMediatorReady) {
            $scope.buttons.pay = false;
            $scope.sessionDetails.status = 'Awating Confirmation from the Conflict Manager.';
            if ($scope.isMediator)
              $scope.sessionDetails.status = 'Awating Confirmation from you as a Conflict Manager.';
          }
        }
        $scope.sessionDynamics = response.session.requestDynamics || {};
      } else {
        window.location = "#/ms/requests";
      }
    });
  };
  load();

  $scope.respond = function (accept) {
    console.log($scope.sessionDetails.id, accept);
    msApi.respondToRequest($scope.sessionDetails.id, accept, function (res) {
      console.log(res);
      if (res.ok) {
        load();
      } else {

      }
    });
  };

  $scope.changeFees = function (ev) {
    let confirm = $mdDialog.prompt()
      .title('Offer Discounts for this session.')
      .textContent('What would be the fees after your special discounts?')
      .placeholder('New Rate ('+$scope.sessionDetails.payableCurrency+'per Hour)')
      .ariaLabel('newRate')
      //.initialValue(20.00)
      .targetEvent(ev)
      .ok('Change')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function (result) {
      console.log(result)
      msApi.actionsToRequest($scope.sessionDetails.id, 10, { oldRate: $scope.myProfile.rate, newRate: (result * 100) }, function (res) {
        if (res.ok) {
          load();
          $scope.myProfile.rate = result;
          bravUI.showSimpleToast('Updated the rate');
        } else {
          // Unable to modify the price
        }
      });
    }, function () {
      // cancel
    });
  };

  $scope.payNow = function (ev) {
    easyPay.chargeNow(ev, $scope.sessionDetails.payable, $scope.sessionDetails.payableCurrency, $scope.sessionDetails.id, '/common/api/ms/pay', function (res) {
      console.log('okay I think its sucess ', res);
      if (res.ok) {
        load();
        bravUI.showSimpleToast('Payment Successfull!')
      } else {
        // payment Cancelled or Stripe failed No Brav server call will go
        bravUI.showSimpleToast('Payment Failed!')
      }
    });
  };

  $scope.redeem = function (ev) {
    let confirm = $mdDialog.prompt()
      .title('Redeem fees for the session')
      .textContent('Please provide the coupon code here')
      .placeholder('Coupon Code')
      .ariaLabel('couponCode')
      //.initialValue(20.00)
      .targetEvent(ev)
      .ok('Apply')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function (result) {
      console.log(result)
      msApi.actionsToRequest($scope.sessionDetails.id, 31, { message: 'redeem coupon', coupon: result }, function (res) {
        console.log('Res of redeem coupon ', res);
        if (res.ok) {
          load();
          bravUI.showSimpleToast('Applied the coupon');
        } else {
          // Unable to modify the price
          bravUI.showSimpleToast('Failed to apply the coupon');
        }
      });
    }, function () {
      // cancel
    });
  };

  $scope.weivePUF = function (ev) {
    let confirm = $mdDialog.prompt()
      .title('Redeem platform usage fees for this session')
      .textContent('Please provide the coupon code here')
      .placeholder('Coupon Code')
      .ariaLabel('couponCode')
      //.initialValue(20.00)
      .targetEvent(ev)
      .ok('Apply')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function (result) {
      console.log(result)
      msApi.actionsToRequest($scope.sessionDetails.id, 31, { message: 'redeem coupon', coupon: result }, function (res) {
        console.log('Res of redeem coupon ', res);
        if (res.ok) {
          load();
          bravUI.showSimpleToast('Applied the coupon');
        } else {
          // Unable to modify the price
          bravUI.showSimpleToast('Failed to apply the coupon');
        }
      });
    }, function () {
      // cancel
    });
  };

  $scope.scheduleSession = function (ev, currentSchedule, id) {
    $mdDialog.show({
      controller: function ($scope, msApi, bravAuthData, bravUI) {
        console.log('Loaded scheduleSessionCtrl')
        if (currentSchedule) {
          if (currentSchedule.epoch) {
            $scope.epoch = currentSchedule.epoch;
          }
        } else {
          $scope.epoch = Date.now();
        }
        $scope.date = '';
        $scope.time = '';
        $scope.times = (() => {
          let arr = [];
          let i = 0;
          let timeStr = '0' + i + ':00 AM'; arr.push({ minutes: i * 60, display: timeStr })
          timeStr = '0' + i + ':30 AM'; arr.push({ minutes: (i * 60) + 30, display: timeStr })
          timeStr = '12' + ':00 PM'; arr.push({ minutes: (12 + i) * 60, display: timeStr })
          timeStr = '12' + ':30 PM'; arr.push({ minutes: ((12 + i) * 60) + 30, display: timeStr })
          for (i = 1; i < 10; i++) {
            timeStr = '0' + i + ':00 AM'; arr.push({ minutes: i * 60, display: timeStr })
            timeStr = '0' + i + ':30 AM'; arr.push({ minutes: (i * 60) + 30, display: timeStr })
            timeStr = '0' + i + ':00 PM'; arr.push({ minutes: (12 + i) * 60, display: timeStr })
            timeStr = '0' + i + ':30 PM'; arr.push({ minutes: ((12 + i) * 60) + 30, display: timeStr })
          }
          for (i = 10; i < 12; i++) {
            timeStr = '' + i + ':00 AM'; arr.push({ minutes: i * 60, display: timeStr })
            timeStr = '' + i + ':30 AM'; arr.push({ minutes: (i * 60) + 30, display: timeStr })
            timeStr = '' + i + ':00 PM'; arr.push({ minutes: (12 + i) * 60, display: timeStr })
            timeStr = '' + i + ':30 PM'; arr.push({ minutes: ((12 + i) * 60) + 30, display: timeStr })
          }
          console.log(arr);
          return arr;
        })();
        $scope.tz = '';
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
        $scope.tzmap = {};
        $scope.tzs.forEach(one => {
          $scope.tzmap[one.value] = one.offset;
        });
        $scope.proceed = function () {
          // send to server
          console.log('printinmg from schedule CTRL : ', $scope.session);
          let finalEpoch = $scope.session.date.getTime();
          //console.log('finalEpoch1 : ',finalEpoch);
          finalEpoch -= (new Date().getTimezoneOffset() * 60 * 1000);
          //console.log('finalEpoch2 : ',finalEpoch);
          finalEpoch += ($scope.tzmap[$scope.session.tz] * 60 * 1000);
          //console.log('finalEpoch3 : ',finalEpoch);
          finalEpoch += (Number($scope.session.time) * 60 * 1000);
          console.log('finalEpoch4 : ', finalEpoch);

          msApi.actionsToRequest(id, 41, {
            newEpoch: finalEpoch
          }, function (res) {
            if (res.ok) {
              load();
              bravUI.showSimpleToast('Session Schedule updated');
              $mdDialog.cancel();
            } else {
              bravUI.showSimpleToast('Unable to update session');
              $mdDialog.cancel();
            }
          });
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        let validate = function () {

        };
      },
      templateUrl: 'pages/CaseServices/html/scheduleSession.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false // Only for -xs, -sm breakpoints.
    });
  };

  $scope.join = function () {
    msApi.openMediationSession();
  };

  $scope.refresh = function () {
    load();
  }

  //sessionsRequestCtrl = $scope;// REMOVE THIS LINE
});
