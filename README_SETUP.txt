PORTFOLIO WITH VISITOR GATE + TELEGRAM ALERTS

Visitors must enter a valid name + email before the portfolio opens.
Every new visitor (and every resume download) is sent to your Telegram.

FILES
  index.html, config.js, assets/, api/notify.js  -> upload all of these to the GitHub repo that Vercel deploys.

TELEGRAM SETUP (one time)
 1. In Telegram search @BotFather > send /newbot > give a name and a username ending in "bot".
    BotFather sends you a token like 123456789:AAxxxxxxxx. Keep it private.
 2. Open your new bot in Telegram and press Start, then send "hi".
 3. Get your chat id: search @userinfobot in Telegram and press Start. It replies with "Id: 123456789".
 4. Vercel > your project > Settings > Environment Variables. Add:
      TELEGRAM_BOT_TOKEN = (the token from step 1)
      TELEGRAM_CHAT_ID   = (the number from step 3)
 5. Vercel > Deployments > latest > ... > Redeploy (environment variables only apply to new deployments).
 6. Open the site, fill the form yourself, and check Telegram.

NOTES
 - The token is only inside Vercel settings, never in the page or GitHub.
 - A visitor is asked once per browser.
 - This gate stops normal visitors. It is not a security lock.
 - The email format is checked and temporary-email domains are blocked, but the mailbox itself is not verified.
 - Add ?from=linkedin (or any word) at the end of your link to see where a visitor came from.
