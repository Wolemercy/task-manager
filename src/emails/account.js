const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendinblueAPIKEY = process.env.SENDINBLUE_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

sendSmtpEmail = {
    to: [{
        email: 'wolemercy@gmail.com',
        name: 'Wole Ajewole'
    }],
    templateId: 59,
    params: {
        name: 'Wole',
        surname: 'Ajewole'
    },
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': sendinblueAPIKEY
    }
};

apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});