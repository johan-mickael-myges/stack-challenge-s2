const { s3Client , bucket } = require('~config/aws');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const slug = require('slug');
const path = require('path');

const generateFileDestination = async (file, folder = 'uploads') => {
    if (!file) {
        throw new Error('No file provided');
    }

    const extension = path.extname(file.originalname);
    const sanitizedFileName = slug(`${uuidv4()}-${path.basename(file.originalname, extension)}`, { lower: true }) + extension;

    const destination = `${folder}/${sanitizedFileName}`;

    return {
        destination: destination,
        url: `https://${bucket}.s3.amazonaws.com/${destination}`
    };
}

const uploadToS3 = async (file, destination = {}) => {
    if (!file) {
        throw new Error('No file provided');
    }

    if (!destination) {
        throw new Error('No destination provided');
    }
    const uploadParams = {
        Bucket: bucket,
        Key: destination.destination,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return destination.url;
};

module.exports = {
    uploadToS3,
    generateFileDestination,
};
