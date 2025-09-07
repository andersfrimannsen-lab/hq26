// This serverless function is no longer in use.
// The application now exclusively uses the local `quotes.json` file.
/*
import { Handler } from '@netlify/functions';
import { GoogleGenAI, Type } from "@google/genai";

interface Quote {
  quote: string;
  author: string;
}

const handler: Handler = async (event, context) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ error: 'API key is not configured.' }),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a short, hopeful, and inspiring quote for someone struggling with their mental health. The quote should be uplifting and not preachy. Provide an author, which can be 'Anonymous' if unknown.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: {
              type: Type.STRING,
              description: "The hopeful quote."
            },
            author: {
              type: Type.STRING,
              description: "The author of the quote. Can be 'Anonymous'."
            }
          },
          required: ["quote", "author"]
        },
      },
    });

    const jsonStr = response.text.trim();
    const generatedQuote = JSON.parse(jsonStr) as Quote;

    if (!generatedQuote.quote || !generatedQuote.author) {
      throw new Error("Generated quote is not in the expected format.");
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify(generatedQuote),
    };

  } catch (error) {
    console.error("Error generating quote from Gemini API:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ error: 'Failed to generate a quote.' }),
    };
  }
};

export { handler };
*/