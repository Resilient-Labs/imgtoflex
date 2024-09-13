import { useState, useEffect } from "react";
import ImageForm from "./components/ImageForm";
import CodeSandbox from "./components/CodeSandbox";
import useImageUploader from "./hooks/useImageUploader";
import useLayoutCodeGenerator from "./hooks/useLayoutCodeGenerator";
import "./App.css";
import { ImageUtils } from "./utils/imageUtils";

const imageUtils = new ImageUtils();

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const { handleSubmit, isImageUploading } = useImageUploader();
  const { handleGetCode, layoutCode } = useLayoutCodeGenerator();
  const [getCodeIsVisibile, setGetCodeIsVisible] = useState(false);
  const [layoutResponse, setLayoutResponse] = useState("");

  // Effect to update response once layoutCode is updated
  useEffect(() => {
    if (layoutCode) {
      setLayoutResponse(layoutCode);
    }
  }, [layoutCode]); // Dependency on code

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    try {
      await imageUtils.validateImage(selectedImage);
    } catch (error) {
      console.log("Image validation error:", error.message);
      alert(error.message);
      return;
    }

    handleSubmit(selectedImage);

    const formData = new FormData();
    formData.append("file", selectedImage);

    setGetCodeIsVisible(true);
  };

  // Get Code using LayoutCodeGenerate
  const onGetCodeClick = async () => {
    await handleGetCode();
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
        onClick={onGetCodeClick}
      >
        Get Code
      </button>
      <div>{layoutResponse}</div>
      <CodeSandbox />
    </>
  );
}

export default App;
