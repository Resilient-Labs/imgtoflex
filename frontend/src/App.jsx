import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AIService } from "./services/aiService";
import { ImageService } from "./services/imageService";

const imageService = new ImageService();
const aiService = new AIService();

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [getCodeIsVisibile, setGetCodeIsVisible] = useState(false);
  const [imageType, setImageType] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    // FormData to handle file upload
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // TODO: Add image validation for file type
      // anthropic only accepts 4 image file types
      setImageType(imageService.validateImage(selectedImage));
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: selectedImage.name }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from server: ", responseData);
        setGetCodeIsVisible(true);
        alert("Image uploaded successfully!");
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }

    const handleGetCode = (event) => {
      const processedImage = imageService.preProcessImage(selectedImage);
      aiService.getCode((imageType = imageType), (imageData = processedImage));
    };
  };
  return (
    <>
      <h1>Image to Code</h1>
      <span>
        Upload your image below. The "Get Code" buttonw will appear after the
        image is successfully uploaded
      </span>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
      <button
        onClick={handleGetCode}
        display={getCodeIsVisibile ? "block" : "none"}
      >
        Get Code
      </button>
    </>
  );
}

export default App;
