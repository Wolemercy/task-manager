const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'wolemercydev@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Hope you enjoy your stay!`
  })
}


const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'wolemercydev@gmail.com',
    subject: 'Goodbye!',
    text: `We're sad to see you go, ${name}. Is there anything we could have done better?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
}