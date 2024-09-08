import { useState } from "react";
import ImageForm from "./components/ImageForm";
import useImageUploader from "./hooks/useImageUploader";
import "./App.css";
import { useEffect, useState } from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AIService } from "./services/aiService";
import { ImageService } from "./services/imageService";

const imageService = new ImageService();
const aiService = new AIService();

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { handleSubmit, isImageUploading } = useImageUploader();
  const [getCodeIsVisibile, setGetCodeIsVisible] = useState(false);
  const [imageFormat, setImageFormat] = useState("");
  const [layoutResponse, setLayoutResponse] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    handleSubmit(selectedImage);
  };

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
    setImageFormat(await imageService.validateImage(selectedImage));
    // const response = await fetch(
    //   `${import.meta.env.VITE_BACKEND_URL}/upload`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ name: selectedImage.name }),
    //   }
    // );

    // if (response.ok) {
    //   const responseData = await response.json();
    //   console.log("Response from server: ", responseData);
    setGetCodeIsVisible(true);
    //     alert("Image uploaded successfully!");
    //   } else {
    //     alert("Image upload failed.");
    //   }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image.");
  }
};


  const handleGetCode = async () => {
    const processedImage = await imageService.preProcessImage(selectedImage);
    const code = await aiService.getCode(imageFormat, processedImage);
    console.log("layout code", code);
    setLayoutResponse(code);
  };

  return (
    <>
      <h1>Image to Code</h1>
      <span>
        Upload your image below. Click the *Get Code* button that will appear
        after the image is successfully uploaded.
      </span>
      {isImageUploading ? (
        <p>Image is being converted</p>
      ) : (
        <p>Please upload a Layout image</p>
      )}
      <ImageForm
        handleSubmit={onFormSubmit}
        onImageChange={handleImageChange}
      />
      <button
        style={{
          display: getCodeIsVisibile ? "inline" : "none",
        }}
        onClick={handleGetCode}
      >
        Get Code
      </button>
      <div>{layoutResponse}</div>
    </>
  );
}

export default App;
