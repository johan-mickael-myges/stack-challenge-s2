const { uploadToS3 } = require('~services/s3Service');
const { s3Client, bucket } = require('~config/aws');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const path = require('path');

jest.mock('~config/aws', () => ({
    s3Client: {
        send: jest.fn()
    },
    bucket: 'test-bucket'
}));

jest.mock('uuid', () => ({
    v4: jest.fn()
}));

jest.mock('slug', () => jest.fn());

describe('uploadToS3', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should upload a file to S3 and return the URL', async () => {
        const file = {
            originalname: 'test file.png',
            buffer: Buffer.from('test buffer'),
            mimetype: 'image/png'
        };

        const mockUuid = '1234';
        const mockSlug = 'test-file-png';
        const expectedUrl = `https://test-bucket.s3.amazonaws.com/folder/${mockUuid}-${mockSlug}.png`;

        uuidv4.mockReturnValue(mockUuid);
        slug.mockReturnValue(mockSlug);

        s3Client.send.mockResolvedValue({});

        await uploadToS3(file, 'folder');

        expect(uuidv4).toHaveBeenCalled();
        expect(slug).toHaveBeenCalledWith(`${mockUuid}-test file`, { lower: true });
        expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));

        const command = s3Client.send.mock.calls[0][0];
        expect(command.input).toEqual({
            Bucket: bucket,
            Key: `folder/${mockSlug}.png`,
            Body: file.buffer,
            ContentType: file.mimetype
        });
    });

    it('should throw an error if no file is provided', async () => {
        await expect(uploadToS3(null)).rejects.toThrow('No file provided');
    });
});
