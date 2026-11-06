import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function sendMessage(text: string) {
    const response = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: text,
        generation_config: {
            thinking_level: "low"
        }
    })

    return response.output_text
}