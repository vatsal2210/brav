/**
 * Created by Omkar Dusane on 08-Oct-16.
 */
let StripeInstance = false;
let constants = {
  enableStrictTimeCheck: false, // for joining sessions used in MediationSessionService
  emailEnable: false,
  passwordHashEnable: false,
  symbols: {
    BRAV_BIG_A: 'BRĀV',
    BRAV_SMALL_A: 'Brāv ',
    BRAV_SMALL_A_ALL: 'brāv'
  },
  enableCoupons: true,
  coupons: ['BRAV17', 'MUMBAI17', 'SEATTLE17', 'IMI2017', '4PS2017',
    'VET17', 'HACK17', 'EVENT17', 'MEDIATE17', 'OMBUDSMAN17',
    'TECH17', 'AI2017', 'VR2017', 'DISCOUNT17'],

  /** SECRET DATA */

  emailId: 'brav.greeting@gmail.com',
  emailPw: 'Success001!',

  superSecret: 'kjfdbgklbfjkbfwoiepowfpeio83424084uh4r4ti4uh87tuhw4t873euygqwifh8i37641239eyofh978ft48gn93y0023y12y4364g7teng48t7391',
  SENDGRID_API_KEY: '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',
  hashSecret: 'djchbd76dvsdv5766ydiwojnddvsdveo9ohefne983wco9qh2doenif',
  stripeTest: {
    key: 'sk_test_CtomErHvJOLsqvhauIGZAVvy',
  },
  //stripeLive : constants.stripeTest,

  getStripeInstance: () => {
    if (!StripeInstance) {
      console.log('Printing Constants : ', constants.stripe)
      //  StripeInstance  = require("stripe")(constants.prod.key);
      StripeInstance = require("stripe")(constants.stripeTest.key);
      if (sails.config.secure.stripeLive) {
        StripeInstance = require("stripe")(sails.config.stripeProd.key);
      }
    }
    return StripeInstance;
    }

};

module.exports.constants = constants;
