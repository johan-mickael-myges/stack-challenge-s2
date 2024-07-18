const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require('~config/config');
const MailerError = require('~errors/MailerError');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendInBlueApiKey;

const sendMail = async (to, subject, htmlContent) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: config.sendInBlueSenderName, email: config.sendInBlueSender };
    sendSmtpEmail.to = [{ email: to }];

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        throw new MailerError();
    }
}

module.exports = sendMail;