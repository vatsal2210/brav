/**
 * Created by Omkar Dusane on 07-Oct-16.
 * 
 * emailService
 */

const helper = require('sendgrid').mail;
var sg = require('sendgrid')(sails.config.constants.SENDGRID_API_KEY);
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://'+sails.config.constants.emailId+':'+sails.config.constants.emailPw+'@smtp.gmail.com');

module.exports = {

  
  /** NodeMailer */

  sendAgreementSigningRequest: (mailId,agreementName,invitedBy,callback)=>{
    var mailOptions = {
      from: 'info@brav.org', // sender address
      to: mailId , // list of receivers
      subject: 'Brāv Agreements Invitation', // Subject line
      text: 'Greetings, \n\n You have been invited to sign an Agreement Session on Brāv platform (https://one.brav.org) \n' +
      'You will be able to view the agreement and sign it once you log into one.brav.org  (Remember to log in using this email id)' +
      'If you dont have an account on one.brav.org, please do register on https://one.brav.org/#/reg .(Remember to register using This email Id as Individual)' +
      'the Details of the agreement are given below : \n\n' +
      'Agreement :' +agreementName+
      'Invited By: ' +invitedBy+
      '\n\n\n- From :\n One Brāv Organization (http://one,brav.org)', // plaintext body
    };
    if(sails.config.constants.emailEnable)
    {
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log('Error in sending email: ',error);
          callback(false);
          return; 
        }
        else{
          callback(true);
          console.log('Email sent to '+mailId);
          console.log('Message sent: ' + info.response);
        }
      });
    }else {
      callback(true);
      console.log('Email senD Disabled but its sent to : '+mailId);
    }
  },

  sendSessionEmailToUser:function(mailId,sessionDetails,org,callback){
    var mailOptions = {
      from: 'Brav.org', // sender address
      to: mailId , // list of receivers
      subject: 'Brav Session Invitation', // Subject line
      text: 'Hello , \n\n You have been invited to have a Mediation Session on Brāv platform (https://one.brav.org) \n' +
      'You will be able to join the session once you log into one.brav.org  (Remember to log in using this email id)' +
      'If you dont have an account on one.brav.org, please do register on https://one.brav.org/#/reg .(Remember to register using This email Id as an INDIVIDUAL )' +
      'the Details of the session are given below : \n\n' +
      'Sessison :' +sessionDetails+
      'Invited By: ' +org+
      '\n\n\n- From :\n One Brāv Organization (http://one,brav.org)', // plaintext body
    };
    if(sails.config.constants.emailEnable)
    {
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          callback(false);
          return console.log(error);
        }
        else{
          callback(true);
          console.log('Email sent to '+mailId);
          console.log('Message sent: ' + info.response);
        }
      });
    }else {
      callback(true);
      console.log('Email senD Disabled but its sent to : '+mailId);
    }
  },

  sendOtp_old : function (mailid, otp, callback) {
    var mailOptions = {
      from: 'Brav- Signup', // sender address
      to: mailid, // list of receivers
      subject: 'Brav OTP', // Subject line
      text: 'Hello there , \n\n your OTP (activation code) for BRAV sign up is '+otp+' . \n\n Thanks for choosing Brav(Beta). please use above OTP to sign in', // plaintext body
    };

    // send mail with defined transport object
    if(sails.config.constants.emailEnable)
    {
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          callback(false);
          return console.log(error);
        }
        else{
          callback(true);
          console.log('OTP sent '+otp);
          console.log('Message sent: ' + info.response);
        }
      });
    }else {
      callback(true);
      console.log('OTP Not sen DIsabled but its '+otp);
    }

  },

  /** SENDGRID API */

  sgSendTest :()=>{
      from_email = new helper.Email("greetings@brav.org");
      to_email = new helper.Email("omkardusane@gmail.com");
      subject = "Sending with SendGrid is Fun";
      content = new helper.Content("text/plain", "and easy to do anywhere, even with Node.js");
      mail = new helper.Mail(from_email, subject, to_email, content);

     var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(request, function(error, response) {
        console.log("Email Send : "+response.statusCode);
        if(response.statusCode == 202){
          next({ok:true,message:'sent Email'})
        }else{
          next({ok:false,message:'Email send failure'})
        }        
        console.log("Response body : ");
        console.log(response.body);
      })
  },

  sendOtp:(mailid, otp, next)=>{
    if(sails.config.constants.emailEnable)
    {
      subject= 'Brav OTP';
      message= 'Hello there , \n\n your OTP (activation code) for BRAV sign up is '+otp+' . \n\n Thanks for choosing Brav.org. please use above OTP to sign in'; // plaintext body
      from_email = new helper.Email("info@brav.org");
      to_email = new helper.Email(mailid);
      subject =  'Brav OTP';
      content = new helper.Content("text/plain",message);
      mail = new helper.Mail(from_email, subject, to_email, content);

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(request, function(error, response) {
        console.log("Email Send : "+response.statusCode);
        if(response.statusCode == 202){
          next(true);
        }else{
          console.log({ok:false,message:'Email send failure'})
          next(false,{ok:false,message:'Email send failure'});
        }        
      });
    }else {
      next(true);
      console.log('OTP DIsabled but its '+otp);
    }
    return;
  },

  sendOtpForForgotPassword:(mailid, otp, next)=>{
    if(sails.config.constants.emailEnable)
    {
      subject= 'Brav OTP';
      message= `Hello, It Seems like you forgot your password, \n\n Your OTP (re-activation code) for BRAV sign up is `+otp
      +`\n\n Thanks for choosing Brav.org. Please email us at "info@brav.org" for any questions.`; // plaintext body
      from_email = new helper.Email("info@brav.org");
      to_email = new helper.Email(mailid);
      subject =  'Brav OTP';
      content = new helper.Content("text/plain",message);
      mail = new helper.Mail(from_email, subject, to_email, content);

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(request, function(error, response) {
        console.log("Email Send : "+response.statusCode);
        if(response.statusCode == 202){
          next(true);
        }else{
          console.log({ok:false,message:'Email send failure'})
          next(false);
        }        
      });
    }else {
      next(true);
      console.log('OTP DIsabled but its '+otp);
    }
    return;
  },

  sendWelcomeEmailToUser:function(mailid,userData,next) {
    if (sails.config.constants.emailEnable) {
      subject = 'Welcome To Brav!';
      from_email = new helper.Email("info@brav.org");
      to_email = new helper.Email(mailid);
      /* Define welcome message specific to type of user */
      welcomeMessage = ""
      switch(userData.type) {
        case 2: if (userData.profile.proMediatorStatusRequested) {
                  welcomeMessage = "We are very excited to welcome you as a Professional Mediator to the Brav platform!";
                } else {
                  welcomeMessage = "We are very excited to welcome you as a Brav One to the Brav platform!";
                }
                break;
        case 3: welcomeMessage = "We are very excited to welcome your Organization to the Brav platform!"
                break;
        case 4: welcomeMessage = "We are very excited to welcome you to the Brav platform!"
                break;
        default: /* Do not send any email for super admin user type */
                 next(true);
                 return;
      }
      /* HTML Message template */
      message = '<!doctype html>' +
                '<html>' +
                '  <head>' +
                '    <meta name="viewport" content="width=device-width">' +
                '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
                '    <title>Welcome To Brav</title>' +
                '  </head>' +
                '  <body>' +
                '    <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 15px;">' +
                '      <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #598fbe; border-radius: 3px;">' +
                '        <tr>' +
                '          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-left:15px">' +
                '            <h1 style="color:white; text-align: center">Welcome To Brav!</h1>' +
                '            <p style="color:white">Hi ' + userData.name + ',</p>' +
                '            <p style="color:white">' + welcomeMessage + '</p>' +
                '          </td>' +
                '        </tr>' +
                '      </table>' +
                '    </div>' +
                '  </body>' +
                '</html>'
      content = new helper.Content("text/html",message);
      mail = new helper.Mail(from_email, subject, to_email, content);

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });

      sg.API(request, function(error, response) {
        console.log("Email Send : "+response.statusCode);
        if (response.statusCode == 202) {
          next(true);
        } else {
          console.log({ok:false,message:'Email send failure'})
          next(false,{ok:false,message:'Email send failure'});
        }
      });
    } else {
      next(true);
      console.log('Email is disabled but welcoming user '+userData.name);
    }
    return;
  },

};
