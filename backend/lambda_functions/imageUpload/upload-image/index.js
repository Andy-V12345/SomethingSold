const AWS = require('aws-sdk');
const busboy = require('busboy');

const s3 = new AWS.S3({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: null,
    };

    const bb = busboy({ headers: { 'content-type': 'multipart/form-data' } });
    const result = {
        fields: {},
        files: []
    };

    return new Promise((resolve, reject) => {
        bb.on('file', (name, file, info) => {
            const { filename, encoding, mimeType } = info;
            const uploadParams = {
                Bucket: 'somethingsold-uploads',
                Key: `images/${filename}`,
                Body: file,
            };
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    result.files.push(data);
                }
            });
        });

        bb.on('field', (name, value) => {
            result.fields[name] = value;
        });

        bb.on('finish', () => {
            response.body = JSON.stringify({ message: 'File uploaded successfully', result });
            resolve(response);
        });

        bb.on('error', (err) => {
            response.statusCode = 500;
            response.body = JSON.stringify({ error: err.message });
            reject(response);
        });

        bb.end(Buffer.from(event.body, 'base64'));
    });
};
