var nodemailer = require('nodemailer');
const mail = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'phchester@gmail.com',
        pass:'Mama!1944'
    }
});
var mailOptions = {
    from: 'phchester@gmail.com',
    to: 'phchester@yahoo.com',
    subject: 'Sending Email via Node.js',
    text: 'That was easy!'
  };
    
const sendCorreo=()=>{
    mail.sendMail(mailOptions, function(error, info){
        console.log('Entro en send mail')
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
module.exports  = {
    sendCorreo
}