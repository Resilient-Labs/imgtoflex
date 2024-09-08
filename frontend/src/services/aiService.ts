import Anthropic, { fileFromPath } from "@anthropic-ai/sdk";

const VITE_ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const defaultPrompt = "Provide the CSS code for the image"; // Need a more robustly engineer prompt
type allowedImageTypes = // Image type validation needed on front end - soft blocker
  "image/jpeg" | "image/png" | "image/gif" | "image/webp";

class AIService {
  client = new Anthropic({
    apiKey: VITE_ANTHROPIC_KEY,
    dangerouslyAllowBrowser: true, // move this to backend
  });

  async getCode(imageType, imageData) {
    let layoutCode = await this.#getLayout(imageType, imageData);
    return layoutCode;
  }

  async #getLayout(
    imageType: allowedImageTypes,
    imageData: string, // there are some constraints here
    prompt: string = defaultPrompt
  ) {
    console.log("imageType:", imageType);
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
