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
    const input = {
        Bucket: "somethingsold-uploads",
        Key: "test_image.jpeg"
    }

    const command = new GetObjectCommand(input)
    const result = await s3Client.send(command)

    console.log(result.Body)

    const response = {
        status: 200,
        body: "success"
    }

    return response

}