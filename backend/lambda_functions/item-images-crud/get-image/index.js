import {
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
    region: 'us-east-1',
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
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
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
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            }
        }
    }
    
}