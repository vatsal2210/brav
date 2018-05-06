/**
 * Created by Omkar Dusane on 10-Feb-17.
 * 
 *  MediationSessionService
 * 
 */


let privates = {
    enlistMediationSessions: (one, queryObject, projectionObject, next) => {
        if (one.yes) {
            queryObject._id = uuidHelperService.makeObjectId(one.sessionId);
            if (one.isMediator) {
                projectionObject['mediators.$'] = 1;
            } else {
                projectionObject['mediators.responded'] = 1;
                projectionObject['mediators.name'] = 1;
                projectionObject['mediators.accepted'] = 1;
                projectionObject['mediators.rate'] = 1;
                projectionObject['mediators.currency'] = 1;
            }
            projectionObject['schedule.epoch'] = 1;
            projectionObject.requestDynamics = 1;
        }
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error 1' })
                return;
            }
            c.find(queryObject, projectionObject).toArray((er2, docs) => {
                if (er2 != null ) {
                    next({ ok: false, message: 'db error 2' })
                    return;
                }
                if (docs == null ) {
                    next({ ok: false, message: 'db error 2', docs })
                    return;
                }
                if (one.yes) {
                    if (docs.length == 1) {
                        // fashion mediators and individuals list
                        let doc = docs[0];
                        individualService.getIndividualsMiniProfilesForMediationSession(doc.individuals, (individualResponse) => {
                            if (individualResponse.ok) {
                                let totalCosts = 0;
                                let payable = 0;
                                let currency = 'USD';
                                doc.mediators.forEach(function (element) {
                                    if (element.responded) {
                                        if (element.accepted) {
                                            payable += element.rate;
                                            totalCosts += element.rate;
                                            currency = element.currency;
                                        }
                                    } else {
                                        totalCosts += element.rate;
                                    }
                                });
                                doc.costs = {
                                    total: totalCosts * doc.sessionObject.hours,
                                    payable: payable * doc.sessionObject.hours,
                                    currency: currency
                                };
                                doc.individuals = doc.individuals.map((indi) => {
                                    let currentIndi = individualResponse.docs.find((indi_from_docs) => { return indi.email == indi_from_docs.email });
                                    if (currentIndi) {
                                        currentIndi.responded = indi.responded;
                                        currentIndi.accepted = indi.accepted;
                                        return currentIndi;
                                    } else {
                                        indi.notAUser = true;
                                        return indi;
                                    }
                                });
                                next({ ok: true, message: 'here is the session request', session: doc });
                            } else {
                                next({ ok: false, message: 'individualResponse didnt work' })
                            }
                        });
                    } else {
                        next({ ok: false, message: 'not such session found' });
                    }
                } else {
                    next({ ok: true, message: 'here are the sessions', sessions: docs });
                }
            });
        });
    },
}

module.exports = {

    /** About Sessions *
     * S1 : create sesison, request mediators and indivs , + message to mediator
     * S2 : Mediator responds to request and can lower the price for the session
     *    session request will have : 
     *            - all session details
     *            - Accept / reject button
     *            - async chat beginning for 10 messages after accept only for creator only
     *            - all people accept status  
     *            - all mediators accept status and rates
     *            - for mediator : to lower the rates for session and accept
     *            - payment options -> pay button for creator only
     *            - after paid , will go to schedule button
     *    My Sessions will have : 
     *            - Session details and all are ready
     *            - Schedule / Reschedule Button
     *            - Join button
     * S3 : as mediator accepts , you can pay
     * S4 : when payment is successful , you can schedule
     * 
    */

    createSession: (sessionObject, creator, individuals, mediators, next) => {
        /** 
         * Created by: 
         *    mediator / org / individual
         * Creation with:
         * step 1 : sessionObject: { case, title, description, hours},
         *                          { status, paymentRef, hours_paid}, creator
         *          participants : { individuals , mediators } with joinstatus
         *          sessionStatus : |1= filed|2=scheduled|3=completed
         * step 2 : schedule: {timestamp,},  acceptace-of-all, 
         */
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            c.count({ 'creator.email': creator.email, 'sessionObject.title': sessionObject.title }, (er2, count) => {
                if (count == 0) {
                    let mongoId = uuidHelperService.newObjectId();
                    c.insert({
                        _id: mongoId,
                        createdAt: TimeHelperService.getNow(),
                        sessionObject: sessionObject,
                        individuals: individuals,
                        mediators: mediators,
                        creator: creator,
                        payment: {
                            // ref :paymentRef,
                            status: MediationSession.flags.PAYMENT_NOT_INITIATED,
                            // hours_paid:hours_paid
                            // type :
                        },
                        sessionStatus: MediationSession.flags.REGISTERED,
                        schedule: false
                    }, (er3, insertResult) => {
                        if (insertResult.result && insertResult.result.n == 1) {
                            next({ ok: true, id: mongoId, message: 'Created Session: ' + sessionObject.title })
                        } else {
                            next({ ok: false, message: 'Could\'nt write to db' })
                        }
                    });
                } else {
                    next({ ok: false, message: 'This title is already present, please modify it' })
                }
            });
        });
    },

    getMediationSessionRequests: (one, email, type, next) => {
        let queryObject = {
            // 'payment.status':{$ne:MediationSession.flags.PAYMENT_SUCCESSFUL}
        };
        let projectionObject = {
            _id: 1,
            createdAt: 1,
            sessionObject: 1,
            individuals: 1,
            'payment.status': 1,
            'sessionStatus': 1
        };
        const get = () => {
            one.isMediator = (type == Users.flags.MEDIATOR);
            privates.enlistMediationSessions(one, queryObject, projectionObject, (resultObject) => {
                if (one.yes) {
                    // calculate Price to pay if not calculated,
                    // resultObject.session.costs = { total: 9500 } ;
                }
                next(resultObject);
            });
        }
        if (type == Users.flags.MEDIATOR) { // mediator
            /*
                mediatorService.getIdByEmail(email,(ok,mediatorId)=>{
                    if(ok){
                        console.log('mediatorId Obtained '+mediatorId)
                        if(typeof mediatorId != 'string'){
                            mediatorId = mediatorId.toString();
                            console.log('mediatorId Casted to string '+mediatorId)
                        }
                        queryObject.$or= [
                            {
                                mediators:{$elemMatch:{email:email}},
                            }, 
                            {
                                mediators:{$elemMatch:{id:mediatorId}},
                            }
                        ];
                        get();
                    }
                });
            */
            queryObject.mediators = { $elemMatch: { email: email } };
            get();
        }
        else if (type == Users.flags.ORG) { // org
            queryObject.creator = { $elemMatch: { email: email, type: type } };
            get();
        }
        else if (type == Users.flags.INDIVIDUAL) { // individual
            queryObject.individuals = { $elemMatch: { email: email } };
            get();
        }
    },

    respondSessionByMediator: (sessionId, mediatorEmail, accept, rate, next) => {
        /** can be accepted by
         *  mediator => payment !
         *  individual => payment !
         */
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            let toSet = {
                'mediators.$.accepted': accept,
                'mediators.$.responded': true,
            };
            if (rate) {
                toSet['mediators.$.rate'] = rate;
            }
            c.update(
                {
                    _id: uuidHelperService.makeObjectId(sessionId),
                    'mediators.email': mediatorEmail
                }
                , { $set: toSet }, { upsert: false },
                (er2, updateResult) => {
                    if (updateResult.result.nModified == 1) {
                        next({ ok: true, message: "Successfully responded " + sessionId + ": " + accept })
                    } else {
                        next({ ok: false, message: 'Could\'nt update this one ' + sessionId })
                    }
                });
        });
    },

    respondSessionByIndividual: (sessionId, iEmail, accept, next) => {
        /** 
         *  can be accepted by
         *  mediator => payment !
         *  individual => payment !
         */
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            c.update(
                {
                    _id: uuidHelperService.makeObjectId(sessionId),
                    'individuals.email': iEmail
                },
                {
                    $set: {
                        'individuals.$.accepted': accept,
                        'individuals.$.responded': true,
                    }
                },
                { upsert: false },
                (er2, updateResult) => {
                    if (updateResult.result.nModified == 1) {
                        next({ ok: true, message: "Successfull recorded " + sessionId + ": " + accept })
                    } else {
                        next({ ok: false, message: 'Could\'nt update this one ' + sessionId })
                    }
                });
        });
    },

    offerDiscount: (sessionId, mediatorEmail, rates, next) => {
        /** 
         *  can be accepted by
         *  mediator => payment !
         *  individual => payment !
         **/
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            let toSet = {
                'mediators.$.rate': rates.newRate,
                'mediators.$.rateComment': 'USD ' + rates.diff + ' discount offered for this case.'
            };
            c.update({
                _id: uuidHelperService.makeObjectId(sessionId),
                'mediators.email': mediatorEmail
            },
                { $set: toSet }, { upsert: false },
                (er2, updateResult) => {
                    if (updateResult.result.nModified == 1) {
                        next({ ok: true, message: "Successfully changed  " + sessionId + ": rate-> " + rates.newRate })
                    } else {
                        next({ ok: false, message: 'Could\'nt update this one ' + sessionId })
                    }
                });
        });
    },

    alterPayment: (type, sessionId, email, data, next) => {
        /**
         *  type: 1 INITIALIZE_PAY ,  2 CANCEL_PAY  , 3_REDEEM 
         *         
         **/
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            let toSet = false;
            if (type == 1) {
                toSet = {}
                toSet['payment.status'] = MediationSession.flags.PAYMENT_INITIATED;
                toSet['payment.ref'] = { by: email, at: TimeHelperService.getNow(), message: 'Payment Initiated' };
            }
            if (type == 2) {
                toSet = {}
                toSet['payment.status'] = MediationSession.flags.PAYMENT_FAIL;
                toSet['payment.ref'] = { by: email, at: TimeHelperService.getNow(), message: 'Payment Failed' };
            }
            if (type == 3) {
                if ((sails.config.constants.coupons.indexOf(data.coupon) > -1) && sails.config.constants.enableCoupons) {
                    toSet = {}
                    toSet['payment.status'] = MediationSession.flags.PAYMENT_BYPASSED;
                    toSet['payment.ref'] = {
                        by: email, at: TimeHelperService.getNow(),
                        message: 'Payment Bypassed with coupon', coupon: data.coupon
                    };
                } else {
                    next({ ok: false, message: 'Could\'nt use the coupon code.' })
                    return;
                }
            }
            if (toSet) {
                c.update({
                    _id: uuidHelperService.makeObjectId(sessionId),
                    'individuals.email': email
                },
                    {
                        $set: toSet
                    },
                    { upsert: false },
                    (er2, updateResult) => {
                        if (updateResult.result.nModified == 1) {
                            next({ ok: true, message: "Successfull acted on : " + sessionId + ", in type=" + type })
                        } else {
                            next({ ok: false, message: 'Could\'nt update this one ' + sessionId })
                        }
                    });
            }
        });
    },

    
    makePayment: (sessionId, email, stripeToken, amount, currency, descriptionData, next) => {
        /**
         *  type: 1 INITIALIZE_PAY ,  2 CANCEL_PAY  , 3_REDEEM 
         *         
         **/
        let charge = (move) => {
            const stripe = sails.config.constants.getStripeInstance();
            var charge = stripe.charges.create({
                amount: amount,
                currency: currency.toLowerCase(),
                description: JSON.stringify(descriptionData),
                source: stripeToken,
            }, function (err, charge) {
                if (!err) {
                    console.log('Payment Successful')
                    move(true);
                } else {
                    console.log('Payment failed')
                    move(false)
                }

            });
        }
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            let set = (type, move) => {
                let toSet = {}
                if (type == 1) {
                    toSet['payment.status'] = MediationSession.flags.PAYMENT_INITIATED;
                    toSet['payment.ref'] = { by: email, at: TimeHelperService.getNow(), message: 'Payment Initiated' };
                }
                if (type == 2) {
                    toSet['payment.status'] = MediationSession.flags.PAYMENT_FAIL;
                    toSet['payment.ref'] = { by: email, at: TimeHelperService.getNow(), message: 'Payment Failed' };
                }
                if (type == 3) {
                    toSet['payment.status'] = MediationSession.flags.PAYMENT_SUCCESSFUL;
                    toSet['payment.ref'] = {
                        by: email,
                        at: TimeHelperService.getNow(),
                        message: 'Payment Successfull',
                        token: stripeToken
                    };
                    toSet['mediators'] = descriptionData.mediatorPayouts;
                    toSet['selectedMediators'] = descriptionData.involvedMediatorsArray;
                }
                c.update({
                    _id: uuidHelperService.makeObjectId(sessionId),
                    'individuals.email': email
                },
                    {
                        $set: toSet
                    },
                    { upsert: false },
                    (er2, updateResult) => {
                        if (updateResult.result.nModified == 1) {
                            move({ ok: true, message: "Successfull acted on : " + sessionId + ", in type=" + type })
                        } else {
                            move({ ok: false, message: 'Could\'nt update this one ' + sessionId })
                        }
                    });

            }
            set(1, moved => {
                if (moved.ok) {
                    charge(charged => {
                        if (charged) {
                            set(3, done => {
                                console.log('done');
                                next({ ok: true, message: 'Payment successfull' })
                            });
                        } else {
                            set(2, done => {
                                console.log('failed by stripe');
                                next({ ok: true, message: 'Payment Failed due to stripe end' })
                            })
                        }
                    });
                } else {
                    set(2, moved => {
                        next({ ok: true, message: 'Payment Failed at our end' })
                    })
                }
            })
        });
    },

    // TODO: send emails after schedule change schedule can be done only after payment is done
    scheduleSession: (sessionId, newEpoch, creator, next) => {
        console.log('Schedule recieved ', newEpoch);
        MediationSession.native((er1, c) => {
            if (er1 != null) {
                next({ ok: false, message: 'db error' })
                return;
            }
            c.update({
                _id: uuidHelperService.makeObjectId(sessionId),
                'payment.status': { $in: [MediationSession.flags.PAYMENT_SUCCESSFUL, MediationSession.flags.PAYMENT_BYPASSED] }
            }, {
                    '$set': { schedule: { epoch: Number(newEpoch), creator: creator }, sessionStatus: MediationSession.flags.SCHEDULED }
                },
                { upsert: false },
                (er2, updateResult) => {
                    if (updateResult.result.nModified == 1) {
                        next({ ok: true, message: 'update the session with the ' + newEpoch + ', Thanks.' })
                    } else {
                        next({ ok: false, message: 'Could\'nt update this one ' + sessionId })
                    }
                });
        });
    },

    // My sessions
    getMediationSessions: (one, email, type, next) => {

        let queryObject = {
            sessionStatus: { $lt: MediationSession.flags.ENDED },
            'payment.status': { $in: [MediationSession.flags.PAYMENT_SUCCESSFUL, MediationSession.flags.PAYMENT_BYPASSED] }
        };

        let projectionObject = {
            _id: 1,
            createdAt: 1,
            sessionObject: 1,
            individuals: 1,
            dynamics: 1,
            'schedule.epoch': 1
        };

        const get = () => {
            privates.enlistMediationSessions(one, queryObject, projectionObject, next);
        };

        if (type == Users.flags.MEDIATOR) { // mediator
            queryObject.mediators = { $elemMatch: { email: email } };
            get();
        }
        else if (type == Users.flags.ORG) { // org
            queryObject.creator = { $elemMatch: { email: email, type: 3 } };
            get();
        }
        else if (type == Users.flags.INDIVIDUAL) { // individual
            queryObject.individuals = { $elemMatch: { email: email } };
            get();
        }

    },

    // For During Session


}