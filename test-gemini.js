// Test script to verify Gemini API is working
import { GoogleGenAI } from "@google/genai";

const testGeminiAPI = async () => {
  try {
    const apiKey = "AIzaSyDG8SWURNuhDS7I78D7dUAJW92x-K0LYhA";
    const ai = new GoogleGenAI({ apiKey });
    
    console.log("🧪 Testing Gemini API...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Say 'Gemini API is working!' in JSON format: {\"status\": \"success\", \"message\": \"Gemini API is working!\"}",
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });
    
    console.log("✅ Gemini API Response:", response.text);
    return true;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return false;
  }
};

// Run test if this is executed directly
if (typeof window !== 'undefined') {
  testGeminiAPI();
}
