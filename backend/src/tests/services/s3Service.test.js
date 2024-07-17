const { s3Client, bucket } = require('~config/aws');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const path = require('path');
const { uploadToS3, generateFileDestination } = require('~services/s3Service');

jest.mock('~config/aws', () => ({
    s3Client: {
        send: jest.fn()
    },
    bucket: 'test-bucket'
}));

jest.mock('uuid');
jest.mock('slug');
jest.mock('path');

describe('S3 Service', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('uploadToS3', () => {
        it('should upload a file to S3 and return the URL', async () => {
            const file = {
                originalname: 'test file.png',
                buffer: Buffer.from('test buffer'),
                mimetype: 'image/png'
            };
            const destination = {
                destination: 'products/1234-test-file-png.png',
                url: 'https://test-bucket.s3.amazonaws.com/products/1234-test-file-png.png'
            };

            s3Client.send.mockResolvedValue({});

            const result = await uploadToS3(file, destination);

            expect(result).toBe(destination.url);
            expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));

            const command = s3Client.send.mock.calls[0][0];
            expect(command.input).toEqual({
                Bucket: bucket,
                Key: destination.destination,
                Body: file.buffer,
                ContentType: file.mimetype
            });
        });

        it('should throw an error if no file is provided', async () => {
            await expect(uploadToS3(null, { destination: 'some/destination' })).rejects.toThrow('No file provided');
        });

        it('should throw an error if no destination is provided', async () => {
            const file = {
                originalname: 'test file.png',
                buffer: Buffer.from('test buffer'),
                mimetype: 'image/png'
            };
            await expect(uploadToS3(file, null)).rejects.toThrow('No destination provided');
        });
    });
});
