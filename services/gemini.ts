import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeCopper = async (
  file: File,
  supplier: string,
  notes: string
): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToPart(file);
    
    const userPrompt = `
    Analyze this copper scrap image.
    Supplier Name: ${supplier || "Unknown Local Dealer"}
    Context/Notes: ${notes || "No specific context provided."}
    
    Provide the standard CopperGuard analysis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        role: 'user',
        parts: [imagePart, { text: userPrompt }]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4, // Lower temperature for more consistent, factual grading
      }
    });

    const text = response.text || "Analysis failed. Please try again.";

    // Parse rating and verdict for structured logging
    // Regex looking for: - **Rating:** [Score] / 10
    const ratingMatch = text.match(/\*\*Rating:\*\*\s*(\d+(\.\d+)?)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

    // Regex looking for: - **Verdict:** [Text]
    const verdictMatch = text.match(/\*\*Verdict:\*\*\s*(.+)/);
    const verdict = verdictMatch ? verdictMatch[1].trim() : "See detailed analysis";

    return {
      markdown: text,
      rating,
      verdict
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze image. Please check your connection and try again.");
  }
};