import React from "react";

function ImageForm({handleSubmit, onImageChange}) {
    return (
        <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={onImageChange}/>
        <button type="submit">Upload Image</button>

        </form>
    )
}

export default ImageForm;