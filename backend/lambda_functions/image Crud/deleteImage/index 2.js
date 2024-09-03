const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { configDotenv } = require("dotenv");

configDotenv();

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

exports.handler = async (event) => {
    try {
        const key = event.queryStringParameters.key;

        const command = new DeleteObjectCommand({
            Bucket: 'somethingsold-uploads',
            Key: key
        });

        await s3Client.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File deleted successfully' }),
        };
    } catch (error) {
        console.log("Error deleting image:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
