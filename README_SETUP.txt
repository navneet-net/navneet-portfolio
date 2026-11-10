PORTFOLIO WITH VISITOR GATE - SETUP

Visitors must enter a valid name + email (or Continue with Google) before the portfolio opens.
Each new visitor's details are emailed to you.

STEP 1 - Email notifications (required)
 1. Go to https://web3forms.com and create a free access key using admin.navneet.net@gmail.com.
 2. They email you the key. Open config.js and paste it in web3formsKey: "..."
 3. Open your live site once, fill the form yourself, and check that the email arrives in admin.navneet.net@gmail.com
    (also check Spam the first time).

STEP 2 - Continue with Google (optional)
 1. Google Cloud Console > APIs & Services > Credentials > Create credentials > OAuth client ID > Web application.
 2. Under Authorized JavaScript origins add your live site address (for example https://yourname.netlify.app).
 3. Copy the Client ID into config.js as googleClientId: "...apps.googleusercontent.com"
 If you leave it empty the Google button is simply hidden.

STEP 3 - Upload
 Upload everything in this folder (index.html, config.js, assets/) to Netlify, GitHub Pages or Cloudflare Pages.

NOTES
 - A visitor is asked once per browser. They can enter again from another device or after clearing site data.
 - This gate stops normal visitors. It is not a security lock: someone who knows how to read page source can still see the content.
 - The email format is checked, temporary-email domains are blocked, and common typos (gmial.com) are caught.
   The mailbox itself is not verified; "Continue with Google" gives a verified email.
