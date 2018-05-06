/**
 * ClientController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getClients: function (req, res) {


    // console.log('req', req.body)


    // if (req.body.id) {
    //   UserService
    //     .getClients(req.body.id)
    //     .exec(function (err, ress) {
    //       console.log("err getUser", err)
    //       console.log("res getUser", ress)
    //       if (err) return res.serverError({
    //         'success': false,
    //         'msg': 'Something went wrong!!! Try again later'
    //       });
    //       if (!ress) return res.ok({
    //         'success': false,
    //         'msg': 'Invalid username or password'
    //       });
    //       return res.ok({
    //         'success': true,
    //         'msg': 'Login successfull',
    //         data: ress
    //       });
    //     });
    // } else {
    //   return res.ok({
    //     "success": false,
    //     "msg": "Please provide valid password and user name"
    //   });
    // }

  }
};
