const { s3Client , bucket } = require('~config/aws');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const path = require('path');

const uploadToS3 = async (file, folder = 'products') => {
    if (!file) {
        throw new Error('No file provided');
    }

    const extension = path.extname(file.originalname);
    const sanitizedFileName = slug(`${uuidv4()}-${path.basename(file.originalname, extension)}`, { lower: true }) + extension;

    const uploadParams = {
        Bucket: bucket,
        Key: `${folder}/${sanitizedFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return `https://${bucket}.s3.amazonaws.com/${uploadParams.Key}`;
};

module.exports = {
    uploadToS3,
};
