# Password Reset Website - Setup Guide

This website allows users to reset their passwords via a web interface connected to Supabase authentication.

## Features

✅ Password reset request via email  
✅ Secure password reset confirmation  
✅ Responsive design (mobile & desktop)  
✅ Real-time form validation  
✅ Supabase integration  

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to initialize
4. Go to **Settings → API** to get your credentials

### 2. Configure Your Credentials

Open `script.js` and replace these values:

```javascript
const SUPABASE_URL = 'https://reybokhaxnnqswjmxljv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleWJva2hheG5ucXN3am14bGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTQ1NzYsImV4cCI6MjA3OTgzMDU3Nn0.i94MvCxm1IQLJIE9W3tC3OTYsn97mytjcC9yErl953Q';
```

**Where to find these:**
- In Supabase Dashboard → Settings → API
- Copy the **Project URL** (SUPABASE_URL)
- Copy the **anon public** key (SUPABASE_ANON_KEY)

### 3. Configure Password Reset Email

1. In Supabase Dashboard, go to **Authentication → Email Templates**
2. Edit the "Confirm signup" or create a custom reset email template
3. Make sure the reset link includes this in the redirect URL:
   ```
   {{ .ConfirmationURL }}?type=recovery
   ```
4. Example reset link:
   ```
   https://yourwebsite.com?type=recovery&access_token={{.Token}}&refresh_token={{.RefreshToken}}
   ```

### 4. Set Redirect URL

1. In Supabase Dashboard → **Authentication → URL Configuration**
2. Add your website URL to "Redirect URLs":
   - For local testing: `http://localhost:3000`
   - For production: `https://yourwebsite.com`
3. Also add: `https://yourwebsite.com?type=recovery`

### 5. Deploy Your Website

Choose one of these options:

**Option A: Vercel (Recommended - Free)**
```bash
npm install -g vercel
vercel
```

**Option B: GitHub Pages**
1. Push to GitHub
2. Enable GitHub Pages in repo settings
3. Set source to main branch

**Option C: Any Web Host**
1. Upload `index.html`, `script.js`, and `styles.css`
2. Make sure HTTPS is enabled
3. Update REDIRECT_URL in script.js if needed

---

## How It Works

### Step 1: User Requests Reset
- User enters email and clicks "Send Reset Link"
- Website calls `supabase.auth.resetPasswordForEmail(email)`
- Supabase sends reset email to user

### Step 2: User Clicks Email Link
- User clicks reset link in email
- Link contains access token and refresh token
- Website detects the `type=recovery` parameter
- Sets user session with the tokens

### Step 3: User Creates New Password
- User enters new password
- Website calls `supabase.auth.updateUser({ password: newPassword })`
- Password is updated and user is logged in
- Redirects to login page

---

## Testing Locally

1. **Start a local server** (if using VS Code):
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"
   - Or run: `python -m http.server 3000`

2. **Test with Supabase Email**:
   - In Supabase Dashboard, go to **Authentication → Users**
   - Create a test user
   - Click reset password link in test email
   - Test the reset flow

---

## Troubleshooting

### "Invalid or expired reset link"
- Check that your Supabase URL and keys are correct
- Verify redirect URLs are set in Supabase settings
- Reset links expire after 24 hours

### Emails not being sent
- Check Supabase email settings in Authentication → Email
- Verify email is linked to a Supabase user account
- Check spam folder

### CORS errors
- Make sure you're using SUPABASE_ANON_KEY (not secret key)
- Enable HTTPS if in production
- Check redirect URLs in Supabase settings

---

## Environment Variables (Optional but Recommended)

For production, use environment variables instead of hardcoding:

```javascript
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
```

Create a `.env` file:
```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

---

## Security Notes

⚠️ **Important:**
- Never expose your SUPABASE_SECRET_KEY in frontend code
- Only use SUPABASE_ANON_KEY (public key) in the browser
- HTTPS is required for password reset in production
- Supabase handles password hashing and security

---

## Mobile App Integration

To use this with your mobile app:

1. Send users a deep link to this website when they need to reset password:
   ```
   https://yourwebsite.com
   ```

2. Or, if your mobile app uses Supabase SDK directly, users can reset without visiting the website

---

## Support

- Supabase Docs: https://supabase.com/docs
- Community: https://discord.supabase.com
