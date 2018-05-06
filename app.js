// no matter where we actually lift from.
process.chdir(__dirname);

// Ensure a "sails" can be located:
(function () {
  var sails;
  try {
    sails = require('sails');
  } catch (e) {
    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
    console.error('To do that, run `npm install sails`');
    console.error('');
    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
    console.error('but if it doesn\'t, the app will run with the global sails instead!');
    return;
  }

  // Try to get `rc` dependency
  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }
  
  //Update: Vatsal : 218-05-05 : Start server based on production (Repository: one.brav.org-development)
  if (process.argv.length == 2) {
    console.log('Test mode : no live key given in Argv[], but Server up using test key')
    sails.lift(rc('sails'), () => {
      sails.config.stripeProd = sails.config.constants.stripeTest;
      socketService.liftSignalMaster();
    });
  } else if (process.argv.length == 3) {
    let CONSTANTS = { stripe: { key: process.argv[2] } }
    console.log('Pord Mode Live hai')
    sails.lift(rc('sails'), () => {
      sails.config.stripeProd = CONSTANTS.stripe;
      socketService.liftSignalMaster();
      console.log("IS PRODUCTION ", sails.config.secure)
    });
  }


  //  sails.http.app.use('/a2k', require('express').static(process.cwd() + '/assets_a2k'));  
})();
