import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { AnalysisResult, SupplierSearchResult, MapLocation } from "../types";

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

export const findSuppliers = async (
  query: string,
  userLocation?: { lat: number; lng: number }
): Promise<SupplierSearchResult> => {
  try {
    // We use gemini-2.5-flash for Maps Grounding
    const model = 'gemini-2.5-flash';
    
    let locationContext = "";
    let toolConfig = undefined;

    if (userLocation) {
      locationContext = `near the user's location (Lat: ${userLocation.lat}, Lng: ${userLocation.lng})`;
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    } else {
      locationContext = `in ${query}`;
    }

    const prompt = `
      Find 5-7 reliable "kabadiwala" (scrap dealers), metal recyclers, or industrial scrap yards ${locationContext}.
      Focus on businesses that likely buy/sell copper, wires, or metal scrap.
      
      For each one found via Google Maps, provide a brief 1-line reason why a small workshop might visit them.
      Use a helpful, business-like tone.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig as any,
      }
    });

    const text = response.text || "No suppliers found. Try a different area.";
    
    // Extract Map chunks from grounding metadata
    const locations: MapLocation[] = [];
    
    // The structure of groundingChunks for maps usually contains 'maps' object
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    for (const chunk of chunks) {
      if (chunk.maps) {
        // We look for title and uri. 
        // The URI is often in 'maps.source.uri' or directly 'maps.uri' depending on exact version,
        // but docs example implies checking the object.
        const mapData = chunk.maps;
        const uri = mapData.uri || mapData.source?.uri;
        
        if (mapData.title && uri) {
           locations.push({
             title: mapData.title,
             uri: uri,
             address: mapData.address // sometimes available
           });
        }
      }
    }

    return { text, locations };

  } catch (error) {
    console.error("Supplier Search Error:", error);
    throw new Error("Could not search for suppliers. Please check internet connection.");
  }
};