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
  app.get("/api/audio-proxy", async (req, res) => {
    const fileId = req.query.id as string;
    if (!fileId) {
      return res.status(400).json({ error: "Missing file id" });
    }
    
    try {
      const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const response = await fetch(url);
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        const confirmMatch = text.match(/confirm=([a-zA-Z0-9_-]+)/);
        if (confirmMatch && confirmMatch[1]) {
          const confirmToken = confirmMatch[1];
          const actualUrl = `${url}&confirm=${confirmToken}`;
          const actualResponse = await fetch(actualUrl);
          
          res.setHeader('Content-Type', actualResponse.headers.get('content-type') || 'audio/mpeg');
          res.setHeader('Accept-Ranges', 'bytes');
          if (actualResponse.headers.has('content-length')) {
            res.setHeader('Content-Length', actualResponse.headers.get('content-length')!);
          }
          
          if (actualResponse.body) {
            const { Readable } = require('stream');
            Readable.fromWeb(actualResponse.body as any).pipe(res);
            return;
          }
        } else {
           // Maybe it's a small file but still returned HTML?
           res.status(500).send("No confirm token found in drive response");
           return;
        }
      } else {
        res.setHeader('Content-Type', contentType || 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');
        if (response.headers.has('content-length')) {
          res.setHeader('Content-Length', response.headers.get('content-length')!);
        }
        if (response.body) {
           const { Readable } = require('stream');
           Readable.fromWeb(response.body as any).pipe(res);
           return;
        }
      }
      res.status(500).send('Could not pipe audio');
    } catch (err: any) {
      console.error('Audio proxy error:', err);
      res.status(500).send('Error proxying audio');
    }
  });

  app.post("/api/gemini/generate", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }
      console.log("Using API KEY:", process.env.GEMINI_API_KEY.substring(0, 5) + "...");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const { userMsg, imagePart, history = [], language = 'es' } = req.body;
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

      const systemInstruction = language === 'en'
        ? "You are MCI's virtual tech assistant. You have your own personality: you are polite, professional, empathetic, smart, and dynamic. Avoid robotic replies and use a varied, natural vocabulary. Answer like a friendly technical advisor. Never provide exact prices (instead, suggest a free technical site visit or contacting sales). If the problem is critical, invite them to contact via WhatsApp. Your replies must be VERY SHORT AND CONCISE (maximum 2 to 3 sentences). Go straight to the point using simple and clear language. Always reply in English."
        : "MCI Soluciones Poliméricas. Eres el asistente virtual de MCI. Tienes personalidad propia: eres muy amable, profesional, empático, inteligente y dinámico. No des respuestas robóticas ni repitas las mismas frases. Varía tu vocabulario y responde con naturalidad, como un asesor técnico amigable. Muestra disposición para ayudar. NUNCA des precios exactos (sugiere una evaluación técnica sin compromiso o enviar mensaje al área de ventas). Si el problema es crítico, invita a contactar por WhatsApp. Tus respuestas deben ser MUY CORTAS Y CONCISAS (máximo 2 a 3 oraciones). Ve directo al grano usando un lenguaje sencillo y accesible. Responde siempre en español.";

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
              systemInstruction
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
