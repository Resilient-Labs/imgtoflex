const allowedImageTypeByExtension = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

class ImageUtils {
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
        "Image not allowed. Please upload image in format: .jpg, .jpeg, .png, .gif, .webp"
      );
    }
  }
}

export { ImageUtils };
