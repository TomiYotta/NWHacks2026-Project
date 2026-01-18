// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SleepDebtLevel } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY || '';

export const getSleepAdvice = async (
  debtHours: number, 
  streakDays: number, 
  level: SleepDebtLevel
): Promise<string> => {
  
  if (!API_KEY) {
    return "AI insights are unavailable. Please configure your API_KEY to receive personalized sleep coaching.";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
You are a compassionate but scientifically accurate sleep health assistant.
The user has a current accumulated sleep debt of ${debtHours.toFixed(1)} hours.
Their current streak of good sleep (>= 8 hours) is ${streakDays} days.
Their classified debt level is: ${level}.

1. Explain the specific health consequences of this specific level of sleep debt (cognitive, physical, emotional).
2. If the debt is high, be firm about the risks. If low, congratulate them.
3. Provide a specific, actionable estimation for recovery (e.g., "Try to sleep 9 hours for the next X days").
4. Keep the tone encouraging but serious about health.
5. Keep the response under 100 words.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return text || "Unable to generate advice at this time.";
  } catch (error: any) {
    console.error("Error fetching Gemini advice:", error);
    
    // Check for specific error types
    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return "API quota exceeded. You've run out of free tokens. Please wait or upgrade your API key.";
    }
    
    if (error.message?.includes('API_KEY_INVALID')) {
      return "Invalid API key. Please check your configuration.";
    }
    
    if (error.message?.includes('429')) {
      return "Too many requests. Please wait a moment and try again.";
    }
    
    return "I'm having trouble connecting to the AI assistant right now. Remember: Consistency is key! Aim for 8 hours of sleep each night.";
  }
};