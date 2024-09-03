const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const busboy = require("busboy");

const s3Client = new S3Client({
    region: 'us-east-1',
});
exports.handler = async (event) => {
    try {
        const key = event.queryStringParameters.key;
        const bucketName = 'somethingsold-uploads';

        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(deleteCommand);
        console.log(`Deleted image at path: ${key}`);

        const contentType = event.headers['content-type'] || event.headers['Content-Type'];

        if (!contentType.startsWith('multipart/form-data')) {
            return {
                statusCode: '400',
                body: JSON.stringify('Invalid content type'),
            };
        }

        const bb = busboy({ headers: { 'content-type': contentType } });
        const uploads = [];

        const directoryPath = key.substring(0, key.lastIndexOf('/'));

        bb.on('file', (fieldname, file, filename) => {
            const chunks = [];

            file.on('data', (data) => {
                chunks.push(data);
            });

            file.on('end', async () => {
                const fileBuffer = Buffer.concat(chunks);

                const command = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: `${directoryPath}/${filename.filename}`, 
                    Body: fileBuffer,
                    ContentType: filename.mimeType,
                });

                const uploadPromise = s3Client.send(command);
                uploads.push(uploadPromise);
            });
        });

        return new Promise((resolve, reject) => {
            bb.on('finish', async () => {
                try {
                    if (uploads.length > 0) {
                        await Promise.all(uploads);
                    }

                    resolve({
                        statusCode: '200',
                        body: JSON.stringify({
                            message: `Replaced image at path: ${directoryPath}/${filename.filename}`,
                        }),
                    });
                } catch (err) {
                    reject({
                        statusCode: '500',
                        body: JSON.stringify({
                            error: err.message,
                        }),
                    });
                }
            });

            bb.on('error', (err) => {
                reject({
                    statusCode: '500',
                    body: JSON.stringify({
                        error: err.message,
                    }),
                });
            });

            const body = Buffer.from(event.body, 'base64');
            bb.end(body);
        });

    } catch (error) {
        console.log('Error:', error);
        return {
            statusCode: '500',
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};