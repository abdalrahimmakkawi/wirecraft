import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Simple high-fidelity token scrubbing to ensure keys cannot leak in console or payloads
function scrubSecureToken(text: string): string {
  if (!text) return "";
  const rawKey = process.env.CIRCUITFORGE_API_KEY || "sk-rJGDGIFoAFrtpMgMHIWBIW71TFuiIqDNhCFU0iRAIjv8q02s";
  return text.split(rawKey).join("[REDACTED_SECURE_TOKEN]");
}

// Rigid, stateful memory IP Rate Limiter to guard the user's credits from spam/abuse
const ipRequestCounts = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 8; // Protective standard limit

function securityRateLimiter(req: any, res: any, next: any) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  
  const record = ipRequestCounts.get(ip);
  if (!record || (now - record.lastReset) > RATE_LIMIT_WINDOW_MS) {
    ipRequestCounts.set(ip, { count: 1, lastReset: now });
    next();
  } else {
    record.count++;
    if (record.count > MAX_REQUESTS_PER_MINUTE) {
      console.warn(`[Security Alert] Rate limit triggered for IP to protect original key: ${ip}`);
      return res.status(429).json({
        error: "Strict rate limit active to guard original credits. Please wait 60 seconds."
      });
    }
    next();
  }
}

// Input sanitizer & prompt injection guard layer
function cleanAndSanitizePrompt(text: string): string {
  if (!text) return "";
  
  // Cut any massive payload attacks
  let cleaned = text.substring(0, 1000);
  
  // Hardened system-level extraction block (protect original key from exposure)
  const forbiddenKeywords = /process\.env|env\.|secret|token|api_key|password|credential|sys\./i;
  if (forbiddenKeywords.test(cleaned)) {
    console.warn(`[Security Warning] Blocked suspicious text referencing environmental variables.`);
    return "[CLEANED SECURE BOUNDARY]";
  }
  
  // Guard against prompt injection or system extraction attempts
  const injectionPatterns = [
    /ignore previous/i,
    /system instruction/i,
    /leak key/i,
    /reveal system/i,
    /api key/i,
    /dan mode/i,
    /print your prompt/i,
    /give me your instructions/i,
    /what is written above/i
  ];
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(cleaned)) {
      cleaned = "[CLEANED SECURE BOUNDARY]";
    }
  }
  
  return cleaned;
}

// Securely run Claude request through custom endpoint with performance optimization
async function runClaudeGatewayRequest(systemInstruction: string, promptText: string, plan: string): Promise<any> {
  const rawKey = process.env.CIRCUITFORGE_API_KEY || "sk-rJGDGIFoAFrtpMgMHIWBIW71TFuiIqDNhCFU0iRAIjv8q02s";
  
  // API key integrity checks (pre-flight validation helper)
  if (!rawKey || typeof rawKey !== 'string' || rawKey.length < 15) {
    throw new Error("API configuration mismatch: credential key is invalid.");
  }

  // Blazingly fast, lightweight model processing mapping
  // We utilize Claude 3.5 Haiku for standard tasks, which decreases latency by up to 4x while preserving perfect structured outputs.
  let targetModel = "anthropic/claude-3-5-haiku"; 
  let maxTokens = 3000;

  if (plan === 'pro' || plan === 'premium') {
    targetModel = "anthropic/claude-3-5-sonnet";
    maxTokens = 5000;
  }

  const endpoint = "https://sz.uyilink.com/v1/messages";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": rawKey.trim(),
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: targetModel,
        max_tokens: maxTokens,
        system: systemInstruction,
        messages: [
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      const redactedErr = scrubSecureToken(errText);
      console.error(`Upstream gateway returned HTTP status ${response.status}`, redactedErr);
      throw new Error(`AI synthesis gate returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    const safeErrorMsg = scrubSecureToken(err.message || "");
    throw new Error(`AI compiler pipeline interface mismatch checklist: ${safeErrorMsg}`);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Forge (Hardware Architecture Generator)
  app.post("/api/forge", securityRateLimiter, async (req, res) => {
    try {
      // Security Payload Verification (Strict JSON parameter checks)
      const allowedKeys = ["query", "systemPrompt", "plan"];
      const bodyKeys = Object.keys(req.body || {});
      const isPayloadSafe = bodyKeys.every(key => allowedKeys.includes(key));
      if (!isPayloadSafe) {
        return res.status(400).json({ error: "Security Alert: Unauthorized properties in request body were blocked." });
      }

      const { query, systemPrompt, plan } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Missing physical query workspace parameters" });
      }

      const cleanQuery = cleanAndSanitizePrompt(query);
      const systemInstruction = `${systemPrompt || ""}. Enforce: BOM maximum 8 items, wiring maximum 5 components, instructions maximum 8 steps. Ensure the response strictly returns a single JSON object matches the schema. Do not output conversational text or markdown.`;

      console.log(`[Claude Compiler] Forging request for plan: ${plan || 'standard'}`);
      
      const upstreamResult = await runClaudeGatewayRequest(systemInstruction, cleanQuery, plan);

      // Normalize return metadata schema to keep the frontend running perfectly
      let parsedText = "";
      if (upstreamResult && upstreamResult.content && Array.isArray(upstreamResult.content)) {
        const textBlock = upstreamResult.content.find((item: any) => item.text || item.value);
        if (textBlock) {
          parsedText = textBlock.text || textBlock.value || "";
        }
      } else if (upstreamResult && typeof upstreamResult === "string") {
        parsedText = upstreamResult;
      } else if (upstreamResult && upstreamResult.text) {
        parsedText = upstreamResult.text;
      }

      res.json({
        content: [
          {
            type: "text",
            text: parsedText
          }
        ]
      });

    } catch (error: any) {
      console.error("[Claude Forge Gate Error]", error.message);
      const secureMsg = scrubSecureToken(error.message);
      res.status(500).json({ error: `Hardware synthesis module failure: ${secureMsg}` });
    }
  });

  // API Route: Refine (Incremental PCB compiler updates)
  app.post("/api/refine", securityRateLimiter, async (req, res) => {
    try {
      // Security Payload Verification (Strict JSON parameter checks)
      const allowedKeys = ["prompt", "systemPrompt", "plan"];
      const bodyKeys = Object.keys(req.body || {});
      const isPayloadSafe = bodyKeys.every(key => allowedKeys.includes(key));
      if (!isPayloadSafe) {
        return res.status(400).json({ error: "Security Alert: Unauthorized properties in request body were blocked." });
      }

      const { prompt, systemPrompt, plan } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Missing refinement prompt parameters" });
      }

      const cleanPrompt = cleanAndSanitizePrompt(prompt);
      const systemInstruction = `${systemPrompt || ""}. Enforce: BOM maximum 8 items, wiring maximum 5 components, instructions maximum 8 steps. Ensure the response strictly returns a single JSON object matches the schema. Do not output conversational text or markdown.`;

      console.log(`[Claude Compiler] Refining request for plan: ${plan || 'standard'}`);

      const upstreamResult = await runClaudeGatewayRequest(systemInstruction, cleanPrompt, plan);

      let parsedText = "";
      if (upstreamResult && upstreamResult.content && Array.isArray(upstreamResult.content)) {
        const textBlock = upstreamResult.content.find((item: any) => item.text || item.value);
        if (textBlock) {
          parsedText = textBlock.text || textBlock.value || "";
        }
      } else if (upstreamResult && typeof upstreamResult === "string") {
        parsedText = upstreamResult;
      } else if (upstreamResult && upstreamResult.text) {
        parsedText = upstreamResult.text;
      }

      res.json({
        content: [
          {
            type: "text",
            text: parsedText
          }
        ]
      });

    } catch (error: any) {
      console.error("[Claude Refine Gate Error]", error.message);
      const secureMsg = scrubSecureToken(error.message);
      res.status(500).json({ error: `PCB optimization module failure: ${secureMsg}` });
    }
  });

  // Vite Middleware or Static Assets serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CircuitForge Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start CircuitForge backend server:", error);
});
