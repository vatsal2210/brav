/**
 * TimeHelperService
 * 
 */
const timezoner = require('moment-timezone');
const moment = require('moment');
const tzs = [ 
            {name:'US Pacific UTC-08:00',value:'PST',offset:480},
            {name:'US Mountain Time UTC-07:00',value:'MT',offset:420},
            {name:'US Central UTC-06:00',value:'CST',offset:360},
            {name:'US East UTC-05:00',value:'EST',offset:300},
            {name:'Eu GMT UTC+00:00',value:'GMT',offset:0},
            {name:'Eu Central ET UTC+01:00',value:'CET',offset:-60},
            {name:'Eu Eastern ET UTC+02:00',value:'EET',offset:-120},
            {name:'South Africa UTC+04:00',value:'SAST',offset:-120},
            {name:'Eu Moscow MSK UTC+03:00',value:'MSK',offset:-180},
            {name:'Gulf GST UTC+04:00',value:'GST',offset:-240},
            {name:'India IST UTC+05:30',value:'IST',offset:-330},
            {name:'Aus AWST UTC+08:00',value:'AWST',offset:-480},
            {name:'Japan JST UTC+09:00',value:'JST',offset:-540},
            {name:'Aus ACST UTC+09:30',value:'AWCT',offset:-570},
            {name:'NZ NZST UTC+12:00',value:'NZST',offset:-720},
        ];
// moment().tz("America/Los_Angeles").format();
/** TimeHelperService */
module.exports = {
    getNow:()=>{
        return (new Date().getTime()) ;
    },

    getUTC:(millis)=>{
        return new Date(millis);
    },

    tzs : tzs,
    tzmap : (()=>{
        let obj = {};
        tzs.forEach(one=>{
            obj[one.value]=one.offset;
        });
        return obj;
    })(),

    lookup : (zoneLabel)=>{
        return TimeHelperService.tzmap[zoneLabel];
    }
         
}