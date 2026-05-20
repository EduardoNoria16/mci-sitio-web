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

      const { userMsg, imagePart } = req.body;
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
