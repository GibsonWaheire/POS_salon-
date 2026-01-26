# Google OAuth Setup Guide - Complete Walkthrough

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project:**
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter project name: `Salonyst POS` (or any name you prefer)
   - Click "Create"
   - Wait for project creation (takes a few seconds)

3. **Select Your Project:**
   - Click the project dropdown again
   - Select your newly created project

## Step 2: Enable Google Identity Services API

1. **Navigate to APIs & Services:**
   - In the left sidebar, click "APIs & Services" → "Library"
   - Or go directly to: https://console.cloud.google.com/apis/library

2. **Enable Google Identity Services:**
   - Search for "Google Identity Services API"
   - Click on it
   - Click "Enable" button
   - Wait for it to enable

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen:**
   - In the left sidebar, click "APIs & Services" → "OAuth consent screen"
   - Or go to: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type:**
   - Select "External" (unless you have a Google Workspace account)
   - Click "Create"

3. **Fill in App Information:**
   - **App name:** Salonyst (or your app name)
   - **User support email:** Your email address
   - **App logo:** (Optional) Upload your app logo
   - **App domain:** (Optional) Your domain if you have one
   - **Developer contact information:** Your email address
   - Click "Save and Continue"

4. **Scopes (Optional):**
   - Click "Add or Remove Scopes"
   - The default scopes (email, profile, openid) are usually sufficient
   - Click "Update" → "Save and Continue"

5. **Test Users (For Testing):**
   - If your app is in "Testing" mode, add test users
   - Click "Add Users"
   - Add email addresses of users who can test the app
   - Click "Save and Continue"

6. **Summary:**
   - Review your settings
   - Click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials:**
   - In the left sidebar, click "APIs & Services" → "Credentials"
   - Or go to: https://console.cloud.google.com/apis/credentials

2. **Create OAuth 2.0 Client ID:**
   - Click "+ Create Credentials" at the top
   - Select "OAuth client ID"

3. **Application Type:**
   - Select "Web application"
   - Give it a name: "Salonyst Web Client"

4. **Authorized JavaScript origins:**
   - Click "+ Add URI"
   - Add your frontend URLs:
     - `http://localhost:5173` (for local development)
     - `https://yourdomain.com` (for production)
   - Example:
     ```
     http://localhost:5173
     https://salonyst.com
     ```

5. **Authorized redirect URIs:**
   - Click "+ Add URI"
   - Add your frontend URLs (same as above):
     ```
     http://localhost:5173
     https://salonyst.com
     ```
   - Note: For Google Identity Services (new method), redirect URIs are less critical, but still add them

6. **Create:**
   - Click "Create"
   - A popup will appear with your **Client ID** and **Client Secret**
   - **IMPORTANT:** Copy these immediately - you won't see the secret again!

## Step 5: Configure Your Application

### Backend Configuration

1. **Update `.env` file in backend directory:**
   ```env
   # Google OAuth (optional - for Google sign-in)
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

   Note: The backend doesn't strictly need these for the current implementation (we're using ID token verification), but it's good to have them for future use.

### Frontend Configuration

1. **Create or update `.env` file in frontend directory:**
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

2. **Important:** 
   - The frontend `.env` file should be in the `frontend/` directory (same level as `package.json`)
   - Restart your development server after adding environment variables
   - For production, set these as environment variables in your hosting platform

## Step 6: Update Frontend HTML (Optional but Recommended)

Add the Google Identity Services script to your HTML head:

1. **Open `frontend/index.html`:**
   ```html
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Salonyst - Management System</title>
     <!-- Google Identity Services -->
     <script src="https://accounts.google.com/gsi/client" async defer></script>
   </head>
   ```

## Step 7: Test the Integration

1. **Start your backend:**
   ```bash
   cd backend
   python app.py
   # or
   flask run
   ```

2. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Google Sign-In:**
   - Navigate to: http://localhost:5173/signup
   - Click on the "Google" tab
   - Click "Continue with Google"
   - You should see Google's sign-in popup
   - Sign in with a test user (if app is in testing mode) or your account
   - After successful authentication, you should be redirected to the dashboard

## Step 8: Production Setup

### For Production Deployment:

1. **Update OAuth Consent Screen:**
   - Go back to OAuth Consent Screen
   - Click "Publish App" when ready
   - This makes it available to all users (not just test users)

2. **Update Authorized URIs:**
   - Go to Credentials → Your OAuth Client
   - Add your production URLs:
     - Authorized JavaScript origins: `https://yourdomain.com`
     - Authorized redirect URIs: `https://yourdomain.com`

3. **Set Environment Variables:**
   - **Vercel/Netlify (Frontend):**
     - Go to Project Settings → Environment Variables
     - Add: `VITE_GOOGLE_CLIENT_ID` = your client ID
   
   - **Railway/Heroku (Backend):**
     - Go to Variables/Config Vars
     - Add: `GOOGLE_CLIENT_ID` = your client ID
     - Add: `GOOGLE_CLIENT_SECRET` = your client secret

## Troubleshooting

### Common Issues:

1. **"Error 400: redirect_uri_mismatch"**
   - Make sure your redirect URI in Google Console matches exactly
   - Check for trailing slashes, http vs https, etc.

2. **"Google sign-in is not configured"**
   - Check that `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
   - Restart your dev server after adding env variables

3. **"Invalid Google token"**
   - Check that the Client ID matches in both frontend and backend
   - Verify the token is being sent correctly

4. **"App is in testing mode"**
   - Add test users in OAuth Consent Screen
   - Or publish the app (make it public)

5. **CORS Issues:**
   - Make sure your backend CORS settings allow your frontend origin
   - Check `CORS_ORIGINS` in backend `.env`

## Security Best Practices

1. **Never commit credentials:**
   - Keep `.env` files in `.gitignore`
   - Use environment variables in production

2. **Restrict Client ID:**
   - In Google Console, you can restrict which domains can use your Client ID
   - Go to Credentials → Your Client → Application restrictions

3. **Use HTTPS in Production:**
   - Google OAuth requires HTTPS in production
   - Use a service like Let's Encrypt for SSL certificates

## Quick Reference

- **Google Cloud Console:** https://console.cloud.google.com/
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Credentials:** https://console.cloud.google.com/apis/credentials
- **Google Identity Services Docs:** https://developers.google.com/identity/gsi/web

## Next Steps

After setup:
1. Test the signup flow with Google
2. Test the login flow with Google
3. Verify users are created correctly in your database
4. Test the checkout flow with Google-authenticated users
