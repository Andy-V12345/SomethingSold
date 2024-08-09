import {
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3"

import { configDotenv } from "dotenv";

configDotenv()

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

export const handler = async (event) => {
    try {
        const key = event.queryStringParameters.key;

        const command = new GetObjectCommand({
            Bucket: 'somethingsold-uploads',
            Key: key
        })

        const response = await s3Client.send(command)

        const bytes = await response.Body.transformToByteArray();
        const base64Body = Buffer.from(bytes).toString('base64')

        return {
            statusCode: '200',
            headers: {
                'Content-Type': response.ContentType,
            },
            body: base64Body,
            isBase64Encoded: true
        }
    }
    catch (error) {
        console.log("Error retrieving image:", error);
        return {
            statusCode: '500',
            body: JSON.stringify({
                error: error.message
            })
        }
    }
    
}