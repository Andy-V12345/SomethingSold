const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const busboy = require("busboy");

const s3Client = new S3Client({
    region: 'us-east-1',
});

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));

    try {
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        console.log("Content-Type:", contentType);

        if (!contentType.startsWith('multipart/form-data')) {
            console.log("Invalid content type");
            return {
                statusCode: 400,
                body: JSON.stringify('Invalid content type'),
            };
        }

        const bb = busboy({ headers: { 'content-type': contentType } });
        let key = null;
        const uploads = [];

        bb.on('field', (fieldname, val) => {
            if (fieldname === 'key') {
                key = val;
                console.log("Received key:", key);
            }
        });

        bb.on('file', (fieldname, file, filename) => {
            const chunks = [];

            file.on('data', (data) => {
                chunks.push(data);
                console.log("Received file data chunk");
            });

            file.on('end', async () => {
                console.log("File upload completed");

                if (key !== null) {
                    const fileBuffer = Buffer.concat(chunks);

                    // First, delete the existing image
                    try {
                        console.log("Attempting to delete image at path:", key);
                        const deleteCommand = new DeleteObjectCommand({
                            Bucket: 'somethingsold-uploads',
                            Key: key,
                        });

                        await s3Client.send(deleteCommand);
                        console.log("Successfully deleted image:", key);
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                        return {
                            statusCode: 500,
                            body: JSON.stringify({
                                error: 'Failed to delete old image.',
                                details: err.message
                            }),
                        };
                    }

                    // Then, upload the new image
                    try {
                        console.log("Attempting to upload new image at path:", key);
                        const command = new PutObjectCommand({
                            Bucket: 'somethingsold-uploads',
                            Key: key,
                            Body: fileBuffer,
                            ContentType: filename.mimeType,
                        });

                        const uploadPromise = s3Client.send(command);
                        uploads.push(uploadPromise);
                        console.log("Successfully started upload for new image:", key);
                    } catch (err) {
                        console.error("Error uploading new image:", err);
                        return {
                            statusCode: 500,
                            body: JSON.stringify({
                                error: 'Failed to upload new image.',
                                details: err.message
                            }),
                        };
                    }
                } else {
                    console.log("No key provided; skipping deletion and upload.");
                }
            });
        });

        return new Promise((resolve, reject) => {
            bb.on('finish', async () => {
                try {
                    console.log("Finished processing form data");

                    if (uploads.length > 0) {
                        await Promise.all(uploads);
                        console.log("Successfully uploaded all images");
                    }

                    resolve({
                        statusCode: 200,
                        body: JSON.stringify({
                            message: 'Image updated successfully',
                        }),
                    });
                } catch (err) {
                    console.error("Error in finish:", err);
                    reject({
                        statusCode: 500,
                        body: JSON.stringify({
                            error: err.message
                        }),
                    });
                }
            });

            bb.on('error', (err) => {
                console.error("Busboy error:", err);
                reject({
                    statusCode: 500,
                    body: JSON.stringify({
                        error: err.message
                    }),
                });
            });

            const body = Buffer.from(event.body, 'base64');
            console.log("Starting busboy parsing with body length:", body.length);
            bb.end(body);
        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err.message
            }),
        };
    }
};
