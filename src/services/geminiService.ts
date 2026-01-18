import { GoogleGenAI } from "@google/genai";
import { SleepDebtLevel } from "../types";

const API_KEY = (import.meta as any).env.VITE_API_KEY || '';

export const getSleepAdvice = async (
  debtHours: number, 
  streakDays: number, 
  level: SleepDebtLevel
): Promise<string> => {
  if (!API_KEY) {
    return "AI insights are unavailable. Please configure your API_KEY to receive personalized sleep coaching.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "I'm having trouble connecting to the sleep database right now. Remember: Consistency is key!";
  }
};