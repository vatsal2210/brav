const whatToUse = 3;
// 1 = local 1337 localhost
// 2 = staging 1337 azure
// 3 = staging 443 azure
const home = '/home/omkardusane/';
const paths = {
  enable : true,
  cert : home+'ssl/nginx_bundle_90998c8a7e35.crt',
  key : home+'ssl/one.brav.org.key'
};

const staging1337 = {
  port: 1337 ,
  secure:{
    ssl:true,
    stripeLive :false
  },
  models: {
    //   connection: 'bravMongo'   // PROD
      connection: 'bravMongo2'  // TEST
  },
	ssl : {
    paths:paths,
    ok : 'yes we have the path',
  },
  signalMasterConfig:{
    "isDev": true,
    "server": {
      "port": 1338,
      "secure": true,
      "key": paths.key,
      "cert": paths.cert,
      "password": null
    },
    "rooms": {
      "maxClients": 6
    },
    "stunservers": [
      {
        "url": "stun:stun.l.google.com:19302"
      }
    ],
    "turnservers": [
      /*{
        "urls": ["turn:your.turn.servers.here"],
        "secret": "turnserversharedsecret",
        "expiry": 86400
      }*/
    ]
  }
};

const prod443 = {
  port: 443 ,
  secure:{
    ssl:true,
    stripeLive :true
  },
  models: {
      connection: 'brav_production_v05'  // Production in v0.5
  },
	ssl : {
    paths:paths,
    ok : 'yes we have the path',
  },
  signalMasterConfig:{
    "isDev": true,
    "server": {
      "port": 1339,
      "secure": true,
      "key": paths.key,
      "cert": paths.cert,
      "password": null
    },
    "rooms": {
      "maxClients": 6
    },
    "stunservers": [
      {
        "url": "stun:stun.l.google.com:19302"
      }
    ],
    "turnservers": [
      /*{
        "urls": ["turn:your.turn.servers.here"],
        "secret": "turnserversharedsecret",
        "expiry": 86400
      }*/
    ]
  }
};

var localhost = {
  port: 1337 ,
  secure:{
    ssl:false,
    stripeLive :true
  },
  models: {
    //   connection: 'bravMongo'   // PROD
      connection: 'bravMongo2'  // TEST
  },
	ssl : {
    paths:paths,
    ok : 'yes we have the path',
    
    //key: require('fs').readFileSync(require('path').resolve(__dirname,paths.key)),
    //cert: require('fs').readFileSync(require('path').resolve(__dirname,paths.cert))

	  //ca: require('fs').readFileSync(require('path').resolve(__dirname,'../../scrts/one_brav_org.ca-bundle')),
	  //key: require('fs').readFileSync(require('path').resolve(__dirname,'../../scrts/one.brav.org.key')),
	  //cert: require('fs').readFileSync(require('path').resolve(__dirname,'../../scrts/one_brav_org.crt'))
	},

  signalMasterConfig:{
    "isDev": true,
    "server": {
      "port": 1338,
      "secure": false,
      "key": paths.key,
      "cert": paths.cert,
      "password": null
    },
    "rooms": {
      "maxClients": 5
    },
    "stunservers": [
      {
        "url": "stun:stun.l.google.com:19302"
      }
    ],
    "turnservers": [
      /*{
        "urls": ["turn:your.turn.servers.here"],
        "secret": "turnserversharedsecret",
        "expiry": 86400
      }*/
    ]
  }
};


const init = ()=>{
    if(whatToUse==2){
      paths.enable = true;
      staging1337.ssl.key = require('fs').readFileSync(require('path').resolve(__dirname,paths.key)) ;
      staging1337.ssl.cert = require('fs').readFileSync(require('path').resolve(__dirname,paths.cert)) ;
      return staging1337;
    }
    if(whatToUse==3){
      paths.enable = true;
      prod443.ssl.key = require('fs').readFileSync(require('path').resolve(__dirname,paths.key)) ;
      prod443.ssl.cert = require('fs').readFileSync(require('path').resolve(__dirname,paths.cert)) ;
      return prod443;
    }
    if(whatToUse==1){
      paths.enable = false;
      return localhost;
    }
}

module.exports = init();

