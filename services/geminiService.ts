
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEpicTaskMotivation = async (taskTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme a tarefa "${taskTitle}" em uma missão épica de RPG para uma criança. 
      Dê um título curto e heroico e uma descrição motivadora de 2 frases.
      Responda estritamente em JSON no formato: {"epicTitle": "...", "motivation": "..."}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      epicTitle: "Missão Especial", 
      motivation: "Você é um herói! Complete esta tarefa para ganhar suas recompensas!" 
    };
  }
};

export const getParentAdvice = async (childProgress: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base neste progresso da criança: ${JSON.stringify(childProgress)}. 
      Dê 3 dicas curtas e práticas para os pais incentivarem mais autonomia. 
      Seja encorajador. Responda em Português do Brasil.`,
    });
    return response.text;
  } catch (error) {
    return "Continue incentivando seu filho com reforço positivo!";
  }
};

export const getRewardSuggestions = async (childStats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base no nível ${childStats.level} da criança e suas estrelas atuais (${childStats.stars}), sugira 3 recompensas criativas e não-materiais. 
      Retorne um JSON com um array de objetos, cada um com "title", "cost" (sugestão de estrelas entre 20 e 150) e "icon" (um emoji único).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              cost: { type: Type.NUMBER },
              icon: { type: Type.STRING }
            },
            required: ["title", "cost", "icon"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Reward Error:", error);
    return [
      { title: "Noite do Cinema", cost: 50, icon: "🍿" },
      { title: "Passeio no Parque", cost: 30, icon: "🌳" },
      { title: "Mestre da Cozinha por um dia", cost: 60, icon: "👨‍🍳" }
    ];
  }
};