// AWS configuration
AWS.config.update({
    region: 'us-east-2', // Replace with your AWS region
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:3f6d070a-b5b6-410f-bcc1-fe3769fdc48c' 
    })
});

const s3 = new AWS.S3();

document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Form submitted');

    const availabilityDate = document.getElementById('availabilityDate').value;
    const price = document.getElementById('price').value;
    const dimensions = document.getElementById('dimensions').value;
    const condition = document.getElementById('condition').value;
    const pictures = document.getElementById('pictures').files;

    const imagePaths = [];

    try {
        // Upload each picture to S3 and get the URL
        for (let i = 0; i < pictures.length; i++) {
            const picture = pictures[i];
            const pictureFileName = `items/${AWS.config.credentials.identityId}-${Date.now()}-${picture.name}`;
            console.log(`Uploading ${pictureFileName}`);

            const pictureParams = {
                Bucket: 'somethingsold-user-uploads',
                Key: pictureFileName,
                Body: picture,
                ContentType: picture.type
            };

            const data = await s3.upload(pictureParams).promise();
            console.log(`Uploaded ${pictureFileName}`);
            imagePaths.push(data.Location); 
        }

        // Prepare item details
        const itemData = {
            availabilityDate: availabilityDate,
            price: price,
            dimensions: dimensions,
            condition: condition,
            timestamp: new Date().toISOString(),
            imagePaths: imagePaths
        };

        // Upload item details as JSON
        const itemBlob = new Blob([JSON.stringify(itemData)], { type: 'application/json' });
        const itemFileName = `items/${AWS.config.credentials.identityId}-${Date.now()}-details.json`;
        console.log(`Uploading ${itemFileName}`);

        const itemParams = {
            Bucket: 'somethingsold-user-uploads',
            Key: itemFileName,
            Body: itemBlob,
            ContentType: 'application/json'
        };

        await s3.upload(itemParams).promise();
        console.log(`Uploaded ${itemFileName}`);

        document.getElementById('message').textContent = 'Your item has been submitted successfully!';
    } catch (error) {
        console.error('Error uploading data: ', error);
        document.getElementById('message').textContent = 'There was an error submitting your item. Please try again.';
    }
});