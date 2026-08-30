export default async function handler(req, res) {
  // Only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      message,
      history = [],
      student = {},
    } = req.body || {};

    // Check message
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // OpenRouter API key
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is missing");

      return res.status(500).json({
        error: "OpenRouter API key is not configured",
      });
    }

    // Student information
    const studentName =
      student?.name || "Student";

    const language =
      student?.language || "English";

    const weakAreas =
      Array.isArray(student?.weakAreas)
        ? student.weakAreas.join(", ")
        : "Not provided";

    const strongAreas =
      Array.isArray(student?.strongAreas)
        ? student.strongAreas.join(", ")
        : "Not provided";

    // System prompt
    const systemPrompt = `
You are EduTwin AI Tutor.

You are a friendly, intelligent and personalized AI tutor for college students.

Student Information:
Name: ${studentName}
Preferred Language: ${language}
Weak Areas: ${weakAreas}
Strong Areas: ${strongAreas}

Rules:

1. Explain concepts in simple language.
2. Give examples whenever useful.
3. For programming questions, explain step by step.
4. If the student asks for Hindi, respond in Hindi.
5. If the student asks for Hinglish, respond in Hinglish.
6. If the student asks for a quiz, ask one question at a time.
7. Adapt explanations according to the student's weak areas.
8. If the student makes a mistake, explain it clearly.
9. Help the student understand instead of simply giving answers.
10. Keep responses suitable for a college student.
11. Be concise but useful.
12. Do not unnecessarily use complicated terminology.
`;

    // Convert chat history
    const previousMessages = Array.isArray(history)
      ? history
          .filter(
            (msg) =>
              msg &&
              msg.text &&
              typeof msg.text === "string"
          )
          .slice(-10)
          .map((msg) => ({
            role: msg.isUser
              ? "user"
              : "assistant",
            content: msg.text,
          }))
      : [];

    // Messages for OpenRouter
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },

      ...previousMessages,

      {
        role: "user",
        content: message.trim(),
      },
    ];

    // Call OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${apiKey}`,

          "HTTP-Referer":
            "https://edutwin-1.vercel.app",

          "X-OpenRouter-Title":
            "EduTwin AI Tutor",
        },

        body: JSON.stringify({
          model: "openrouter/free",
          messages,
          temperature: 0.7,
          max_tokens: 1200,
        }),
      }
    );

    const data = await response.json();

    // OpenRouter error
    if (!response.ok) {
      console.error(
        "OpenRouter Error:",
        JSON.stringify(data, null, 2)
      );

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenRouter request failed",
      });
    }

    // Extract response
    const aiResponse =
      data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        error: "AI returned an empty response",
      });
    }

    // Success
    return res.status(200).json({
      response: aiResponse,
    });

  } catch (error) {
    console.error(
      "Vercel AI Error:",
      error
    );

    return res.status(500).json({
      error: "AI server error",
      message: error.message,
    });
  }
}