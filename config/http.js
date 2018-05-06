
var jwt = require('jsonwebtoken');

//Update: Vatsal : 2018-05-05 : https Setting
var fs = require('fs');


var express = require('express');
module.exports.http = {
  middleware: {
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'bodyParser',
      'authJwtParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],
  },

  //Update : Vatsal : 2018-05-05 : Express ServerOption changes

  customMiddleware: function (app) {
    var options = {
      debug: true
    };

    var PeerServer = require('peer').PeerServer;
    var server = PeerServer({
      port: 5103, path: '/api',
      // ssl: {
      //   key: fs.readFileSync('/home/brav/brav_demo/config/certs_new/stagingsdei_com.key', 'utf8'),
      //   cert: fs.readFileSync('/home/brav/brav_demo/config/certs_new/6a221c743fff90ed.crt', 'utf8')
      // }
    });

  },

  express: {
    serverOptions: {
      key: fs.readFileSync(__dirname + '/localhost.key'),
      cert: fs.readFileSync(__dirname + '/localhost.csr')
    }


  },
  ssl: {
    key: fs.readFileSync(__dirname + '/localhost.key'),
    cert: fs.readFileSync(__dirname + '/localhost.csr')
  }
};
