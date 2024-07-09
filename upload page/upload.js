// AWS configuration
AWS.config.update({
    region: 'YOUR_AWS_REGION', // Replace with your AWS region
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'YOUR_IDENTITY_POOL_ID' // Replace with your Identity Pool ID
    })
});

const s3 = new AWS.S3();

document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const availabilityDate = document.getElementById('availabilityDate').value;
    const price = document.getElementById('price').value;
    const dimensions = document.getElementById('dimensions').value;
    const condition = document.getElementById('condition').value;
    const pictures = document.getElementById('pictures').files;

    const itemData = {
        availabilityDate: availabilityDate,
        price: price,
        dimensions: dimensions,
        condition: condition,
        timestamp: new Date().toISOString()
    };

    try {
        // Upload item details as JSON
        const itemBlob = new Blob([JSON.stringify(itemData)], { type: 'application/json' });
        const itemFileName = `items/${AWS.config.credentials.identityId}-${Date.now()}-details.json`;

        const itemParams = {
            Bucket: 'YOUR_S3_BUCKET_NAME', // Replace with your S3 bucket name
            Key: itemFileName,
            Body: itemBlob,
            ContentType: 'application/json'
        };

        await s3.upload(itemParams).promise();

        // Upload each picture
        for (let i = 0; i < pictures.length; i++) {
            const picture = pictures[i];
            const pictureFileName = `items/${AWS.config.credentials.identityId}-${Date.now()}-${picture.name}`;

            const pictureParams = {
                Bucket: 'YOUR_S3_BUCKET_NAME', // Replace with your S3 bucket name
                Key: pictureFileName,
                Body: picture,
                ContentType: picture.type
            };

            await s3.upload(pictureParams).promise();
        }

        document.getElementById('message').textContent = 'Your item has been submitted successfully!';
    } catch (error) {
        console.error('Error uploading data: ', error);
        document.getElementById('message').textContent = 'There was an error submitting your item. Please try again.';
    }
});
