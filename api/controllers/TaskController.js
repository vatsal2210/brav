/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  taskpage: function (req, res) {
    if (req.session.userId && req.session.loggedin) {
      UserService
        .checkLogin(req.session.userId)
        .exec(function (err, ress) {
          if (err) {
            ress.redirect('/');
          }
          else if (!res) {
            ress.redirect('/');
          }
          else {
            res.view();
          }
        });
    } else {
      res.redirect('/');
    }
  },
};

