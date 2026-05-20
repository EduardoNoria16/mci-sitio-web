import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Parse body gracefully if it's text
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
    }

    const { userMsg, imagePart } = body || {};
    const parts: any[] = [];
    if (userMsg) parts.push({ text: userMsg });
    if (imagePart) {
      parts.push(imagePart);
    }

    // Generate response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: "MCI Soluciones Poliméricas. Eres un experto técnico de MCI. TUS RESPUESTAS DEBEN SER MUY CORTAS Y CONCISAS. Máximo 2 o 3 oraciones breves por respuesta. Ve directo al grano. NUNCA des precios exactos (indica que se requiere visita técnica). Si el problema es crítico, invítalo a contactarnos por WhatsApp. Usa lenguaje sencillo que cualquier persona pueda entender fácilmente."
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorString = String(error);
    if (errorString.includes("suspended") || errorString.includes("API_KEY_INVALID")) {
      res.status(403).json({ error: "Llave de API inválida o suspendida. Por favor actualiza GEMINI_API_KEY en tu hosting." });
    } else {
      res.status(500).json({ error: "Failed to generate content", details: errorString });
    }
  }
}
