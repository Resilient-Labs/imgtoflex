import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import AWS from 'aws-sdk';
import Prompt from './models/promptSchema.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

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
mongoose.connect(MONGO_URI).then(() => console.log("Connected to DB")).catch(error => console.log(error));

/*
app.post('/upload', upload.single('file'), async (req, res) => {
    const { file } = req; // Image file for S3 integration
    const { imageName, imageType, imageSize } = req.body; // Other data
   
    // Upload the file to S3
    const params = {
        Bucket: S3_BUCKET,
        Key: `${Date.now()}_${file.originalname}`, // Unique filename for each upload
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const s3Response = await s3.upload(params).promise();
        const prompt = new Prompt({ imgName: imageName });
        await prompt.save();

        res.status(200).json({ message: "Image uploaded", s3Url: s3Response.Location });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).json({ message: "Failed to upload image" });
    }
});
*/

app.post('/upload',upload.single('file') ,async (req,res) => {
  const { file } = req; //Image file for S3 integration
  const { imageName, imageType, imageSize } = req.body; //other data
  
  console.log('File:', file);
  console.log('Image Name:', imageName);
  console.log('Image Type:', imageType);
  console.log('Image Size:', imageSize);

  const prompt = new Prompt({imgName: imageName});
  await prompt.save();
  res.status(200).json({message: "Image received", name: imageName})
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
