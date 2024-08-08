import { configDotenv } from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import busboy from "busboy";

configDotenv()

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
})

export const handler = async (event) => {

    try {
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        
        if (!contentType.startsWith('multipart/form-data')) {
            return {
                statusCode: '400',
                body: JSON.stringify('Invalid content type'),
            };
        }

        const bb = busboy({ headers: { 'content-type': contentType } });
        let metadata = null;
        const uploads = []

        bb.on('file', (fieldname, file, filename) => {
            const chunks = []

            file.on('data', (data) => {
                chunks.push(data)
            })

            file.on('end', async () => {
                if (metadata !== null) {
                    const fileBuffer = Buffer.concat(chunks);

                    const command = new PutObjectCommand({
                        Bucket: 'somethingsold-uploads',
                        Key: `${metadata.imagePath}/${filename.filename}`,
                        Body: fileBuffer,
                        ContentType: filename.mimeType
                    })

                    const uploadPromise = s3Client.send(command);
                    uploads.push(uploadPromise);
                }
            });
        })

        bb.on('field', (fieldname, val) => {
            if (fieldname === 'metadata') {
                metadata = JSON.parse(val)
            }
        })

        return new Promise((resolve, reject) => {
            bb.on('finish', async () => {
                try {
                    if (uploads.length > 0) {
                        await Promise.all(uploads);
                    }

                    resolve({
                        statusCode: '200',
                        body: JSON.stringify({
                            message: 'File uploaded successfully',
                        }),
                    });
                } catch (err) {
                    reject({
                        statusCode: '500',
                        body: JSON.stringify(`Error: ${err.message}`),
                    });
                }
            });

            bb.on('error', (err) => {
                reject({
                    statusCode: '500',
                    body: JSON.stringify(`Error: ${err.message}`),
                });
            });

            const body = Buffer.from(event.body, 'base64');
            bb.end(body);
        });

    } catch (err) {
        return {
            statusCode: '500',
            body: JSON.stringify(`Error: ${err.message}`),
        }
    }

}


