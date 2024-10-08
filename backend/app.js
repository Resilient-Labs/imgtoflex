import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Prompt from "./models/promptSchema.js";
import path from "path";
import { fileURLToPath } from "url";
import { AIService } from "./services/aiService.js";

// Calculate __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const aiService = new AIService();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
const urlencodedMiddleware = express.urlencoded({ extended: true });
const jsonMiddleware = express.json();

app.use(cors());
app.use(express.json());

// Sets up the ability for us to run the front end from the backend.
app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Configure AWS SDK
const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Set backend state variables to null
let fileBufferState = null; // Stores file buffer to memory for use by other routes
let fileMimeTypeState = null; // Stores file type to memory for use by other routes

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.post("/upload", upload.single("file"), async (req, res) => {
    const { file } = req; // Image file for S3 integration
    const { imageName } = req.body; // Other data

    if (!file) {
        console.log("No file uploaded");
        return res.status(400).json({ message: "No file uploaded." });
    }

    fileBufferState = file.buffer;
    fileMimeTypeState = file.mimetype;

    // Upload the file to S3
    const params = {
        Bucket: S3_BUCKET,
        Key: `${Date.now()}_${file.originalname}`, // Unique filename for each upload
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        // Use AWS SDK v3's PutObjectCommand and s3.send() for upload
        const command = new PutObjectCommand(params);
        const s3Response = await s3.send(command);

        const prompt = new Prompt({ imgName: imageName });
        await prompt.save();

        res.status(200).json({
            message: "Image uploaded",
            s3Url: `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`,
        });
    } catch (error) {
        console.error("Error uploading to S3:", error);
        res.status(500).json({ message: "Failed to upload image" });
    }
});


// Call Claude API with image file state and type in memory
app.post("/generateLayoutCode", async (req, res) => {
  if (!fileBufferState) {
    console.log("No image file found in memory");
    return res.status(400).json({ message: "No image file found in memory." });
    // Todo: Pull file from database and update filebufferstate
  }

  if (!fileMimeTypeState) {
    console.log("No image format found in memory");
    return res.status(400).json({ message: "No image format found in memory" });
    // Todo: Pull file type from database and update file mimetype state to use
  }

  // Convert image file to base64string
  const imageData = fileBufferState.toString("base64");
  const imageFormat = fileMimeTypeState;
  console.log("imageFormat:", imageFormat, " , ", "imageData", imageData);

  // Validate request data
  if (!imageFormat || typeof imageFormat != "string") {
    return res.status(400).json({ message: "Invalid image format'" });
  }

  if (!imageData || typeof imageData !== "string") {
    return res.status(400).json({ message: "Invalid image data" });
  }

  try {
    // Call AIService
    const code = await aiService.getCode(imageFormat, imageData);

    // Send response with generated code
    res.status(200).json({ layoutCode: code });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Failed to generate layout code" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
