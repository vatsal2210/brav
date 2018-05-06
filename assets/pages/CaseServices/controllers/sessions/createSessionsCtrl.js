caseServices.controller('createSessionsCtrl', function ($scope, msApi, caseApi, bravAuthData, bravConfig, bravUI, $mdDialog) {
    $scope.puf = bravConfig.PLATFORM_USAGE_FEES;
    $scope.totalCost = 0;

    $scope.sessionObject = { individualsArray: [], hours: '' };
    $scope.isMediator = (bravAuthData.getType() == 2);
    $scope.mediatorsArray = [];

    if ($scope.isMediator) {
        console.log("if mediator get name of urself... Make API for this");
    }
    else {
        $scope.mediatorsArray = msApi.getMediatorArray();
        if ($scope.mediatorsArray.length == 0) {
            window.location = '#/m/select';
        }
    }

    caseApi.getAllCases(function (res) {
        if (res.ok) {
            $scope.cases = res.cases.map(function (c) { return { _id: c._id, title: c.title } });
            if ($scope.cases.length == 0) {
                swal({
                    title: 'You must create a case first to link the session',
                    type: 'info'
                });
                window.location = "#/case/new"
            }
        } else {
            console.log('issue in loading cases');
            alert('Issue in loading cases')
        }
    });

    $scope.updateCost = function () {
        if (!$scope.isMediator) {
            $scope.currency = '';
            $scope.mediatorsArray.forEach(function (mediator) {
                $scope.totalCost += mediator.rate;
                if ($scope.currency) {
                    $scope.currency = mediator.currency;
                } else if ($scope.currency != mediator.currency) {
                    $scope.currency = '';
                }
            });
            $scope.totalCost += $scope.puf;
        } else {
            $scope.totalCost += $scope.puf;
        }
    };

    $scope.updateCost();

    $scope.validateChip = function (chip) {
        if (validateEmail(chip))
            return undefined;
        else return null;
    };

    $scope.createSession = function (ev) {
        let created = false;
        let missingotherParties = $mdDialog.confirm()
            .title('Emails of all Other Parties Involved are not provided, Are you sure you want to create this session with only you and the mediator?')
            .textContent('You are about to create a session without any other people in dispute, You must enlist all the people you wish to have in the session, and only go ahead if you wish to have no other parties in the session between you and the mediator selected.')
            .ariaLabel('Information')
            .targetEvent(ev)
            .ok('Yes create session without other parties!')
            .cancel('go back');
        let createNow = function () {
            if (!$scope.isMediator) {
                $scope.sessionObject.mediatorsArray = $scope.mediatorsArray.map((obj) => { return obj.id });
            }
            console.log('Ready to go ahead', $scope.sessionObject);
            msApi.createMediationSession($scope.sessionObject, function (response) {
                console.log('response : ', response)
                if (response.ok) {
                    $mdDialog.alert({
                        title: 'Attention',
                        textContent: 'This is an example of how easy dialogs can be!',
                        ok: 'Close'
                    });
                    window.location = '#/ms/requests';
                } else {
                    console.log('some error occurred');
                }
            });
        };
        if (!$scope.sessionObject.title || !$scope.sessionObject.description || !$scope.sessionObject.hours || !$scope.sessionObject.case._id) {
            bravUI.showSimpleToast('Enter all Fields');
        }
        else
            if ($scope.sessionObject.individualsArray.length == 0) {
                $mdDialog.show(missingotherParties).then(createNow, function () { });
            }
            else {
                createNow();
            }
    };

});
