const allowedImageTypeByExtension = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

class ImageService {
  async validateImage(image) {
    let imageType = await this.#validateImageTypeByRegex(image);
    return imageType;
  }

  async #validateImageTypeByRegex(image) {
    // Regex to Find File Extension
    const imageFileExtension = image.name.match(/\.(\w+)$/);
    if (
      imageFileExtension &&
      imageFileExtension[0] in allowedImageTypeByExtension
    ) {
      return allowedImageTypeByExtension[imageFileExtension[0]];
    } else {
      throw new Error(
        "Image not allowed. Image must be .jpg, .jpeg, .png, .gif, .webp"
      );
    }
  }

  // Alternate method to find the extension
  // async #validateImageTypeByLast10(image) {
  //   let imageType;
  //   const last10OfFileName = image.name.slice(-10);
  //   for (const key of allowedImageTypeByExtension) {
  //     if (last10OfFileName.includes(key))
  //       return allowedImageTypeByExtension[key];
  //     if (!imageType) {
  //       throw new Error(
  //         "Image not allowed. Image type must be .jpg, .png, .gif, .webp"
  //       );
  //     }
  //   }
  // }

  async preProcessImage(image) {
    let processedImage = await this.#encodeImage(image);
    return processedImage;
  }

  // Encodes image into Base64
  async #encodeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Sets login inside reader on what to do after successful file read
      reader.onloadend = () => {
        // Sets logic inside the read after the file is read.
        // Data URL constains base64 encouded image data so we can parse out what we need
        // from the Data URL to get the base64String we need.
        const base64String = reader.result.split(",")[1];
        // console.log("Base64 String:", base64String);
        resolve(base64String);
      };

      // Sets logic inside the reader to handle error
      reader.onerror = (error) => {
        reject(new Error("Error reading file:" + error.message));
      };

      // Initiates the file reading process now that all the logic inside the reader is set
      reader.readAsDataURL(file);
    });
  }
}

export { ImageService };
