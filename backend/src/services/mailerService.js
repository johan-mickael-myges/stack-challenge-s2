const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require('~config/config');
const MailerError = require('~errors/MailerError');
const render = require('~services/ejsTemplateRendererService');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendInBlueApiKey;

const sendMail = async (recipients, subject, templateName, data) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const htmlContent = await render(templateName, data);

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: config.sendInBlueSenderName, email: config.sendInBlueSender };
    if (Array.isArray(recipients)) {
        sendSmtpEmail.to = recipients.map(email => ({ email }));
    } else {
        sendSmtpEmail.to = [{ email: recipients }];
    }

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        throw new MailerError();
    }
}

module.exports = sendMail;