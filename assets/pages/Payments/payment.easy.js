//"use strict"

paymentModule.service('easyPay', function ($http, bravAuthData, bravConfig, bravCommunicationHelper, $mdDialog) {
    const stripeHelperBuilder = {
        chargeNow: function (ev, amount, currency, trxnId, api_url, next) {
            let charger = function (cardObject) {
                Stripe.setPublishableKey(bravConfig.getStripeKey());
                Stripe.card.createToken({
                    number: cardObject.number,
                    cvc: cardObject.cvc,
                    exp_month: cardObject.month,
                    exp_year: cardObject.year
                }, function (status, response) {
                    if (status == 200 && !response.error) {
                        let toSendBrav = { stripeToken: response.id, trxnId: trxnId, amount: amount };
                        console.log("calling /calling brav servr :", api_url, " with ", toSendBrav);
                        bravCommunicationHelper.vanilla(true, api_url, toSendBrav, function (res) {
                            console.log('Response from brav server : ', res);
                            /** To continue and show success or failure of payment */
                            if (res.ok)
                                $mdDialog.cancel();
                            next(res);
                        });
                    }
                    else if (!!response.error) {
                        // We dont have a token from stripe
                        next({ ok: false, message: 'One of the card details are incorrect', error: response.error });
                    } else {
                        next({ ok: false, message: 'Some error occurred' })
                    }
                });
            };

            $mdDialog.show({
                controller: function ($scope, bravAuthData) {
                    console.log('Loaded EasypayController. ')
                    $scope.erMsg = '';
                    $scope.responseMessage = 'Payment Successfull';
                    $scope.loading = false;
                    $scope.card = {};
                    $scope.months = (() => { let arr = []; for (let i = 1; i < 13; i++) { arr.push('' + i) }; return arr; })();
                    $scope.years = (() => { let arr = []; for (let i = 2017; i < 2071; i++) { arr.push('' + i) }; return arr; })();
                    $scope.amount = amount;
                    $scope.proceed = function () {
                        console.log('----Payment---- Card = ', $scope.card);
                        if (validateCard($scope.card)) {
                            $scope.loading = true;
                            charger($scope.card);
                        }
                    };
                    $scope.cancel = function () {
                        next({ ok: false });
                        $mdDialog.cancel();
                    };
                    let validateCard = function (card) {
                        if (!Stripe.card.validateExpiry(card.month, card.year)) {
                            $scope.erMsg = 'Invalid Expiry Date';
                        }
                        else if (!Stripe.card.validateCardNumber(card.number)) {
                            $scope.erMsg = 'Invalid Card Number';
                        }
                        else if (!Stripe.card.validateCVC(card.cvc)) {
                            $scope.erMsg = 'Invalid CVV';
                        } else {
                            return true
                        }
                        return false;
                    };
                },
                templateUrl: 'pages/Payments/easyPay.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true // Only for -xs, -sm breakpoints.
            });
        }
    }; return stripeHelperBuilder;
}); // Service ends
