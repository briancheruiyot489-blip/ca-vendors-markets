# CA Vendors Markets

A responsive vendor-market landing page and application form. A successful application sends a notification to the configured Telegram chat. The bot token is kept on the server and is never exposed to website visitors.

## Important security step

The Telegram bot token previously shared in chat should be treated as compromised. Open **@BotFather**, revoke that token using `/revoke`, select the bot, and generate a new token. Do not paste the new token into public code, a browser script, or a public repository.

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm install`.
3. Set the environment variables in your terminal:

   **macOS / Linux**
   ```bash
   export TELEGRAM_BOT_TOKEN="YOUR_NEW_TOKEN"
   export TELEGRAM_CHAT_ID="1240269042"
   npm start
   ```

   **Windows PowerShell**
   ```powershell
   $env:TELEGRAM_BOT_TOKEN="YOUR_NEW_TOKEN"
   $env:TELEGRAM_CHAT_ID="1240269042"
   npm start
   ```

4. Open `http://localhost:3000`.
5. In Telegram, open your bot and press **Start** before testing. The bot must be able to message your chat.

## Deploy

Deploy this folder as a Node.js web service on a host such as Render, Railway, or another Node-compatible host. Set these private environment variables in the host dashboard:

- `TELEGRAM_BOT_TOKEN` = the newly generated bot token
- `TELEGRAM_CHAT_ID` = `1240269042`

Build command: `npm install`  
Start command: `npm start`

Do not upload a real `.env` file or include the bot token in `public/`.

## What this starter does

- Displays a market introduction, experience, application steps, and vendor form.
- Validates required fields and email format on the server.
- Sends applicant details to Telegram after a successful submission.
- Includes basic request rate limiting and a honeypot spam field.
- Does not currently save applications to a database; Telegram receives the submitted details. Add a database if you also need a searchable application dashboard.
