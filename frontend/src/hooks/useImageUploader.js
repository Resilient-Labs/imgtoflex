import { useState } from "react";

const backendURL = import.meta.env.VITE_BACKEND_URL


const useImageUploader = () => {
    const [isImageUploading, setIsImageUploading] = useState(false);

    const handleSubmit = async (selectedImage) => {
        if (!selectedImage) {
            alert("Please select an image.");
            return;
        }

        setIsImageUploading(true);

        try {
            const response = await fetch(`${backendURL}/upload`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: selectedImage.name }),
            });

            if (response.ok) {
                const serverResponse = await response.json();

                console.log("Response from server: ", serverResponse);
                alert("Image uploaded successfully!");
            } else {
                alert("Image upload failed.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image.");
        } finally {
            setIsImageUploading(false);
        }

    }

    return { handleSubmit, isImageUploading };
}

export default useImageUploader;