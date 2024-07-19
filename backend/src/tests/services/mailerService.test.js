const SibApiV3Sdk = require('sib-api-v3-sdk');
const sendMail = require('~services/mailerService');
const MailerError = require('~errors/MailerError');
const config = require('~config/config');
const render = require('~services/ejsTemplateRendererService');

jest.mock('sib-api-v3-sdk');
jest.mock('~services/ejsTemplateRendererService');

jest.mock('~config/config', () => ({
    sendInBlueApiKey: 'test-api-key',
    sendInBlueSender: 'test-sender@example.com',
    sendInBlueSenderName: 'test-sender-name'
}));

describe('sendMail', () => {
    const apiInstanceMock = {
        sendTransacEmail: jest.fn()
    };

    beforeAll(() => {
        SibApiV3Sdk.TransactionalEmailsApi.mockImplementation(() => apiInstanceMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send an email successfully', async () => {
        apiInstanceMock.sendTransacEmail.mockResolvedValue({});
        render.mockResolvedValue('<h1>Test Content</h1>');

        await expect(sendMail('test@example.com', 'Test Subject', 'testTemplate', { name: 'Test' })).resolves.not.toThrow();

        expect(apiInstanceMock.sendTransacEmail).toHaveBeenCalledWith(expect.objectContaining({
            subject: 'Test Subject',
            htmlContent: '<h1>Test Content</h1>',
            sender: { name: config.sendInBlueSenderName, email: config.sendInBlueSender },
            to: [{ email: 'test@example.com' }]
        }));
    });

    it('should throw a MailerError if sending email fails', async () => {
        apiInstanceMock.sendTransacEmail.mockRejectedValue(new Error('API Error'));
        render.mockResolvedValue('<h1>Test Content</h1>');

        await expect(sendMail('test@example.com', 'Test Subject', 'testTemplate', { name: 'Test' })).rejects.toThrow(MailerError);
    });

    it('should throw an error if rendering the template fails', async () => {
        render.mockRejectedValue(new Error('Render Error'));

        await expect(sendMail('test@example.com', 'Test Subject', 'testTemplate', { name: 'Test' })).rejects.toThrow(Error);
    });
});
