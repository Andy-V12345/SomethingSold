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
    const response = {
        statusCode: '200',
        body: null,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    };

    
}