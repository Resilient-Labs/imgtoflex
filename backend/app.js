import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import AWS from 'aws-sdk';
import Prompt from './models/promptSchema.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

app.use(cors());
app.use(express.json());

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: REGION
});

const s3 = new AWS.S3();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
console.log("upload  :", upload)
mongoose.connect(MONGO_URI).then(() => console.log("Connected to DB")).catch(error => console.log(error));

app.post('/upload', upload.single('file'), async (req, res) => {
    const { file } = req; // Image file for S3 integration
    console.log("file    :", file)
    const { imageName, imageType, imageSize } = req.body; // Other data
    console.log("______________________")
   
    // Upload the file to S3
    const params = {
        Bucket: S3_BUCKET,
        Key: `${Date.now()}_${file.originalname}`, // Unique filename for each upload
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    console.log("______________________")
    console.log("params    :", params)

    try {
        const s3Response = await s3.upload(params).promise();
        console.log('S3 Response:', s3Response);

        const prompt = new Prompt({ imgName: imageName });
        await prompt.save();

        res.status(200).json({ message: "Image uploaded", s3Url: s3Response.Location });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).json({ message: "Failed to upload image" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
