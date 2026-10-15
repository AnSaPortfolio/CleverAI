import { gemini } from "../config/gemini.js";

export async function generateResponse(message: string) {
  const interaction = await gemini.interactions.create({
    model: "gemini-3.8-flash",
    input: message,
    generation_config: {
      thinking_level: "medium",
    },
  });

  if (interaction.status !== "completed" || !interaction.output_text) {
    throw new Error("Gemini did not complete the response");
  }

  return {
    answer: interaction.output_text,
    interactionId: interaction.id,
  };
}
