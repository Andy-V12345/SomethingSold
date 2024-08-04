const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { configDotenv } = require('dotenv');

configDotenv();

const s3 = new AWS.S3({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

const app = express();
app.use(express.json());
app.use(awsServerlessExpressMiddleware.eventContext());

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'somethingsold-uploads',
        key: function (req, file, cb) {
            cb(null, `images/${req.body.item_id}/${file.originalname}`);
        }
    })
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully', file: req.file });
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};
