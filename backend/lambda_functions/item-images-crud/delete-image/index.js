import {
    S3Client,
    DeleteObjectCommand
} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
    region: 'us-east-1',
});

export const handler = async (event) => {
    try {
        const key = event.queryStringParameters.key
        const command = new DeleteObjectCommand({
            Bucket: 'somethingsold-uploads',
            Key: key
        })

        await s3Client.send(command)

        return {
            statusCode: '200',
            body: JSON.stringify({
                message: `Deleted image at path: ${key}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            }
        }
    }
    catch (error) {
        console.log('Error:', error)
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