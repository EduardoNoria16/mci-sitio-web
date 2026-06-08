import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';

dotenv.config({ override: true });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Add logging for requests
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`${req.method} ${req.path}`);
    }
    next();
  });

  // Proxy Gemini API Call
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }
      console.log("Using API KEY:", process.env.GEMINI_API_KEY.substring(0, 5) + "...");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const { userMsg, imagePart, history = [] } = req.body;
      const parts: any[] = [];
      if (userMsg) parts.push({ text: userMsg });
      if (imagePart) {
        parts.push(imagePart);
      }

      const contents: any[] = [];
      for (const msg of history) {
        if (msg.text) {
          contents.push({ role: msg.role === 'model' ? 'model' : 'user', parts: [{ text: msg.text }] });
        }
      }
      contents.push({ role: 'user', parts });

      // Generate response with model fallback chain (gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash) to prevent 429 quota exhaustion
      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      let response: any = null;
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting generation with model ${modelName}...`);
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: "Eres el asistente virtual de MCI Soluciones Poliméricas. ¡Tienes una gran personalidad! Eres ingenioso, ocurrente, con sentido del humor (cómico a veces), pero SIEMPRE súper servicial, empático y profesional. Nunca des respuestas robóticas o aburridas, exprésate con emoción y humanidad. Para problemas técnicos o dudas de servicios industriales, comerciales o de manufactura (recubrimientos poliméricos, epóxicos, pisos industriales, poliuretano, impermeabilización), USA TU CONOCIMIENTO TÉCNICO EXPERTO REAL para asesorar adecuadamente basándote en química, materiales y normativas, aportando conocimiento valioso real. Nunca des precios exactos, sugiere amablemente una evaluación técnica. Si es crítico, anima a usar WhatsApp. NUNCA uses formato markdown (NO uses **asteriscos** para negritas, ni formatos complejos). Solo texto plano normal claro y amigable. Sé MUY BREVE, RESPUESTAS CORTAS (1 a 3 oraciones máximo), no satures al cliente con mucho texto."
            }
          });
          if (response && response.text) {
            console.log(`Successfully generated content using model: ${modelName}`);
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed, trying next option:`, err.message || err);
          lastError = err;
          const errMsg = String(err);
          if (errMsg.includes("suspended") || errMsg.includes("API_KEY_INVALID")) {
            throw err;
          }
        }
      }

      if (!response) {
        throw lastError || new Error("All fallback models failed.");
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const errorString = String(error);
      if (errorString.includes("suspended") || errorString.includes("API_KEY_INVALID")) {
        res.status(403).json({ error: "Llave de API inválida o suspendida. Por favor actualiza GEMINI_API_KEY." });
      } else if (errorString.includes("429") || errorString.includes("quota") || errorString.includes("RESOURCE_EXHAUSTED")) {
        res.status(429).json({ error: "Se ha excedido el límite de uso de la IA (Quota). Por favor, intenta de nuevo en unos minutos o proporciona una llave de API diferente." });
      } else {
        res.status(500).json({ error: "Error de Gemini: " + errorString });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support history mode fallback for SPA
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
