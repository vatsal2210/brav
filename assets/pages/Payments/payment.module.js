var paymentModule = angular.module('paymentModule',['bravAuthModule']);
/* 

paymentModule.service('stripeHelper', function ($http,bravAuthData) {
const stripeHelperBuilder = {
    globalTestStripeKey : 'pk_test_7GYgoqP9BzkUs1cA2UniqZJN',
    callBravServer : function(params_2 , cb_bravServer ){
            // Insert the token ID into the form so it gets submitted to the server:
            console.log("calling /calling brav servr :  stripeToken = ",params_2.stripeToken)
                var settings = {
                    "async": true,
                    "crossDomain": false,
                    "url": "/payment/checkout",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded",
                        "cache-control": "no-cache",
                        "x-access-token": bravAuthData.auth.token
                    },
                    "data": bodyparser({
                    //  trxnId: params_2.trxnId ,
                        planId: params_2.trxnId ,
                        stipeToken : params_2.stripeToken ,
                        pcost :params_2.pcost,
                        // more cruicial data
                    })
                };
                $http(settings).success(function (response) {
                console.log(response);
                if(response.ok){
                      // TODO : callback with proper success
                      cb_bravServer({message:'payment done successfully',ok:true})
                    }else{
                    // bad request possible if Front end is compromisedand data is tampered
                    alert("Failed to charge the person with given Token");
                      // TODO : callback with proper error
                      cb_bravServer({message:'payment not done from brav server',ok:false})
                    }
                });
    },

    callStripe : function(params_1 , cb_stripe){
        const cardObject = params_1 ;
        console.log("calling /calling stripe servr to get stripeToken ")

        Stripe.setPublishableKey(this.globalTestStripeKey);
        Stripe.card.createToken({
            number:cardObject.cardNo,
            cvc:cardObject.cvc,
            exp_month:cardObject.expMonth,
            exp_year:cardObject.expYear
        }, function(status, response){
            console.log(status)
            console.log(response)
            if(status == 200 && !response.error){
                stripeHelperBuilder.callBravServer({ stripeToken : response.id , trxnId : params_1.planId, pcost : params_1.pcost},cb_stripe);
                return;
            }
            if(!!response.error){
                // We dont have a token from stripe
                cb_stripe({ok:false,message:'One of the card details are incorrect',error:response.error});
            }else{
                // all good we have Token


                /*

                this.callBravServer({ stripeToken : response.id , planId : params_1.planId} ,
                    function(resultOfBravCall){ // Definition of cb_bravServer
                        if(resultOfBravCall.ok){
                              cb_stripe({ok:true,message:'Payment Successful'})
                        }else{
                              cb_stripe({ok:true,message:'Payment not Successful'})
                        }
                });

                 callBravServer({ stripeToken : response.id , trxnId : params_1.trxnId} ,
                    function(resultOfBravCall){ // Definition of cb_bravServer
                              cb_stripe(resultOfBravCall)
                });

                callBravServer({ stripeToken : response.id , trxnId : params_1.trxnId},cb_stripe);

                * /
            }
        });
    },
    };
    return stripeHelperBuilder;
}); // Service ends
 */