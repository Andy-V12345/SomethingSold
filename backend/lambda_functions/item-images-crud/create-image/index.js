import { configDotenv } from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

configDotenv()

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
})

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

    const postData = JSON.parse(event.body)

    const command = new PutObjectCommand({
        Bucket: 'somethingsold-uploads',
        Key: postData.imagePath,
        Body: postData.encodedImage
    })

    await s3Client.send(command)

    response.body = "UPLOADED IMAGE"

    return response

}


