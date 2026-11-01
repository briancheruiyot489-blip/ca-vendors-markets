const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "1240269042";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." }
});

function clean(value, max = 250) {
  return String(value || "").trim().replace(/[<>]/g, "").slice(0, max);
}

app.post("/api/apply", submitLimiter, async (req, res) => {
  try {
    if (!BOT_TOKEN) {
      console.error("Missing TELEGRAM_BOT_TOKEN environment variable.");
      return res.status(503).json({ error: "Applications are temporarily unavailable. Please try again later." });
    }

    // Honeypot field: real visitors leave this blank.
    if (clean(req.body.website, 120)) {
      return res.json({ ok: true });
    }

    const fullName = clean(req.body.fullName, 100);
    const businessName = clean(req.body.businessName, 120);
    const email = clean(req.body.email, 160);
    const phone = clean(req.body.phone, 40);
    const productType = clean(req.body.productType, 120);
    const location = clean(req.body.location, 120);
    const message = clean(req.body.message, 700);
    const consent = req.body.consent === true;

    if (!fullName || !businessName || !email || !phone || !productType || !location || !consent) {
      return res.status(400).json({ error: "Please complete all required fields and confirm the privacy notice." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const text = [
      "🛍️ NEW CA VENDORS MARKETS APPLICATION",
      "",
      `Name: ${fullName}`,
      `Business: ${businessName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Products: ${productType}`,
      `Location: ${location}`,
      `Message: ${message || "—"}`,
      "",
      `Submitted: ${new Date().toISOString()}`
    ].join("\n");

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        disable_web_page_preview: true
      }),
      signal: AbortSignal.timeout(10000)
    });

    const telegramData = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram notification failed:", telegramData.description || telegramResponse.status);
      return res.status(502).json({ error: "We couldn't send your application right now. Please try again." });
    }

    return res.json({ ok: true, message: "Thank you! Your vendor application has been submitted." });
  } catch (error) {
    console.error("Application error:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`CA Vendors Markets is running on port ${PORT}`);
});
