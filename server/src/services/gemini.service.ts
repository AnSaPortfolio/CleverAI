import { gemini } from "../config/gemini.js";

export async function generateResponse(message: string) {
  const interaction = await gemini.interactions.create({
    model: "gemini-3.8-flash",
    input: message,
    system_instruction: `
      Дай відповідь на повідомлення користувача.
      Також створи короткий заголовок розмови:
      3–6 слів, максимум 80 символів, мовою користувача.
    `,
    generation_config: {
      thinking_level: "medium",
    },
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: {
        type: "object",
        properties: {
          answer: {
            type: "string",
            description: "Відповідь на повідомлення користувача",
          },
          title: {
            type: "string",
            description: "Короткий заголовок розмови",
          },
        },
            },
    },
  });

  if (interaction.status !== "completed" || !interaction.output_text) {
    throw new Error("Gemini did not complete the response");
  }

  const result = JSON.parse(interaction.output_text);

  if (
    typeof result?.answer !== "string" ||
    !result.answer.trim() ||
    typeof result?.title !== "string" ||
    !result.title.trim()
  ) {
    throw new Error("Gemini returned an invalid response");
  }

  return {
    answer: result.answer.trim(),
    title: result.title.trim(),
    interactionId: interaction.id,
  };
}