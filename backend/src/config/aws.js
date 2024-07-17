const { S3Client } = require('@aws-sdk/client-s3');
const config = require('./config');

const s3Client = new S3Client({
    region: config.awsRegion,
    credentials: {
        accessKeyId: config.awsAccessKeyId,
        secretAccessKey: config.awsSecretAccessKey,
    },
});

const bucket = config.s3Bucket;

module.exports = {
    s3Client,
    bucket,
};