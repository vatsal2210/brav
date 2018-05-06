
var express = require('express');
module.exports.http = {
customMiddleware: function (app) {
        //sails.express.app.use('/a2k', express.static(process.cwd() + '/assets_a2k'));
        app.use('/a2k', express.static(process.cwd() + '/assets_a2k'));
   }
};