import Anthropic, { fileFromPath } from "@anthropic-ai/sdk";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
console.log("anthropic key", ANTHROPIC_KEY);

const defaultPrompt = "Provide the CSS code for the image"; // Need a more robustly engineer prompt
const allowedImageTypes =
  // Image type validation needed on front end - soft blocker
  ["image/jpeg", "image/png", "image/gif", "image/webp"];

class AIService {
  client = new Anthropic({
    apiKey: ANTHROPIC_KEY,
    // dangerouslyAllowBrowser: true, // move this to backend
  });

  async getCode(imageType, imageData) {
    let layoutCode = await this.#getLayout(imageType, imageData);
    return layoutCode;
  }

  async #getLayout(imageType, imageData, prompt = defaultPrompt) {
    // Parameter validation
    if (
      typeof imageType != "string" ||
      !allowedImageTypes.includes(imageType)
    ) {
      console.log("Invalid image type");
      throw new Error("Invalid image type.");
    }

    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (typeof imageData != "string" || !base64Pattern.test(imageData)) {
      console.log("Invalid image data");
      throw new Error("Invalid image data");
    }

    let message;
    try {
      message = await this.client.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imageType,
                  data: imageData,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.log("error caught", error.message);
      throw new Error("Error in request to Claude API" + error.message);
    }
    if (message) {
      console.log("message", message.content);
      return message.content[0].text;
    }
  }
}

export { AIService };
