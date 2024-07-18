const SibApiV3Sdk = require('sib-api-v3-sdk');
const sendMail = require('~services/mailerService');
const MailerError = require('~errors/MailerError');
const config = require('~config/config');

jest.mock('sib-api-v3-sdk');

jest.mock('~config/config', () => ({
    sendInBlueApiKey: 'test-api-key',
    sendInBlueSender: 'test-sender',
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

        await expect(sendMail('test@example.com', 'Test Subject', '<h1>Test Content</h1>')).resolves.not.toThrow();

        expect(apiInstanceMock.sendTransacEmail).toHaveBeenCalledWith(expect.objectContaining({
            subject: 'Test Subject',
            htmlContent: '<h1>Test Content</h1>',
            sender: { name: config.sendInBlueSenderName, email: config.sendInBlueSender },
            to: [{ email: 'test@example.com' }]
        }));
    });

    it('should throw a MailerError if sending email fails', async () => {
        apiInstanceMock.sendTransacEmail.mockRejectedValue(new MailerError());

        await expect(sendMail('test@example.com', 'Test Subject', '<h1>Test Content</h1>')).rejects.toThrow(MailerError);
    });

    it('should throw error if got invalid config', async () => {
        jest.mock('~config/config', () => ({}));

        await expect(sendMail('test@example.com', 'Test Subject', '<h1>Test Content</h1>')).rejects.toThrow(MailerError);
    });
});
