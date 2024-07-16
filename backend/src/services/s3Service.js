const { s3, bucket } = require('../config/aws');

const test = async () => {
    try {
        await s3.headBucket({ Bucket: bucket }).promise();
        console.log('AWS S3 is accessible');
    } catch (error) {
        throw new Error('AWS S3 is not accessible');
    }
}
module.exports = {
    test,
};
