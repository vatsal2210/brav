/**
 * UtilsController
 *
 * @description :: Server-side logic for managing utils
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getAvailableTimeZones : (req,res)=>{
        res.json({ok:true,timezones:TimeHelperService.tzs,map:TimeHelperService.tzmap});
    },
};

