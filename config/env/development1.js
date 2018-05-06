/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var fs = require('fs');

module.exports = {
  port: 5102,
  ssl: {
    key: fs.readFileSync('/home/brav/brav_demo/config/certs_new/stagingsdei_com.key', 'utf8'),
    cert: fs.readFileSync('/home/brav/brav_demo/config/certs_new/6a221c743fff90ed.crt', 'utf8')
  }

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

};
