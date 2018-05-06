caseServices.controller('selectMediatorCtrl', function ($scope, msApi, $mdDialog) {
    $scope.mediators = []; // this is all mediators
    $scope.currencies = [
        { name: 'United States Dollar, USD', code: 'USD' },
        { name: 'British Pound, GBP', code: 'GBP' },
        { name: 'Euro, EUR', code: 'EUR' },
        { name: 'Please select a currency', code: 'DASH' },
    ]
    $scope.paymentCurrency = 'USD';
    // $scope.$watch('paymentCurrency', function (newValue, oldValue) {
    //     console.log('paymentCurrency changed = ',newValue);
    //     //angular.copy(someVar, $scope.someVar);
    //     $scope.mediators = $scope.mediators.map(mpro => {
    //         mpro.show = mpro.currency == newValue;
    //         return mpro;
    //     })
    // });
    $scope.loadMediatorsPage = function () {
        msApi.getAllMediators(function (res) {
            console.log(res);
            if (res.ok) {
                res.list.forEach((mediator) => {
                    let mpro = {};
                    if (!!mediator.profile) {
                        mpro = mediator.profile;
                        mpro.id = mediator._id;
                        mpro.show = true;
                        mpro.name = mediator.name;
                        mpro.tz = mediator.tz;
                        if (!mediator.hasOwnProperty('currency')) {
                            mpro.currency = 'USD';
                        } else {
                            mpro.currency = mediator.currencya;
                        }
                        mpro.rate = mpro.rate / 100;// conversion to Decimal currency like 100 cents to 1 Dollor
                        if (mpro.specialities && mpro.specialities.length > 0) {
                            mpro.specialitiesString = mpro.specialities.reduce((o, sum) => { return "" + o + "" + sum + ", " }, '');
                            if (mpro.specialitiesString.length > 2);
                            mpro.specialitiesString = mpro.specialitiesString.substring(0, mpro.specialitiesString.length - 2);
                            mpro.checked = false;
                            $scope.mediators.push(mpro);
                        }
                    }
                });
            }
        });
    };

    $scope.mediatorsArray = [];  // all selected mediators
    $scope.addOrRemoveMediator = function (mediator) {
        if ($scope.paymentCurrency == '') {
            $scope.paymentCurrency = mediator.currency;
        }
        if ($scope.paymentCurrency != mediator.currency) {
            var confirm = $mdDialog.confirm()
                .title('You are selecting a mediator from different currency. Please Select mediators who accept same currency.')
                .ok('Ok, Don\'t select this one');
            $mdDialog.show(confirm).then(function () {
                let index = $scope.mediators.indexOf(mediator);
                console.log("index ==", index);
                if (index > -1) {
                    $scope.mediators[index].checked = false;
                }
                //$scope.mediatorsArray = [];
            }, function () {

            });
        } else {
            let index = $scope.mediatorsArray.indexOf(mediator);
            if (index > -1) {
                $scope.mediatorsArray.splice(index, 1);
                return;
            } else {
                $scope.mediatorsArray.push(mediator);
            }
        }
    };
    $scope.sendMediators = function () {
        msApi.setMediatorArray($scope.mediatorsArray);
        window.location = '#/ms/new';
    };

});
