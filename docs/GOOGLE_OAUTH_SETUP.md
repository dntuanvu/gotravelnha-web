# Google OAuth Setup Guide

## Overview
This guide will help you set up Google OAuth authentication for the GoTravelNha application.

## Prerequisites
- Google Cloud Console account
- PostgreSQL database with migrations applied

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
   - Click "Create"
   - Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## Step 3: Apply Database Migration

Run the Prisma migration to add OAuth fields:

```bash
npx prisma migrate dev --name add_oauth_fields
```

This will add the following fields to the `User` model:
- `provider` (String): OAuth provider name (e.g., "google")
- `providerId` (String): OAuth provider's user ID
- `providerImage` (String): User's profile image URL
- `password` is now optional (nullable)

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected back and logged in

## How It Works

### Flow
1. **User clicks "Sign in with Google"** → Redirects to `/api/auth/google`
2. **Google OAuth endpoint** → Generates auth URL and redirects to Google
3. **User authenticates with Google** → Google redirects back with auth code
4. **Callback endpoint** (`/api/auth/google/callback`) → Exchanges code for user info
5. **User lookup/creation**:
   - Checks if user exists by email or Google ID
   - Creates new user if not found
   - Updates existing user with Google info if needed
6. **Session established** → User is logged in and redirected

### User Account Creation
- Username is auto-generated from email (e.g., `john.doe@gmail.com` → `johndoe`)
- If username exists, numbers are appended (e.g., `johndoe1`, `johndoe2`)
- For OAuth users, a random password hash is generated (not used for login)
- All users default to `USER` role unless created by admin

### Security Notes
- OAuth tokens are exchanged server-side (code flow)
- User passwords are hashed with bcrypt
- OAuth users get random password hashes (security best practice)
- Redirect URIs must match exactly in Google Console

## Troubleshooting

### "Google OAuth credentials not configured"
- Make sure `.env` file has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` set
- Restart your development server after adding env vars

### "Redirect URI mismatch"
- Check that the redirect URI in `.env` matches exactly in Google Console
- For production, update both the `.env` and Google Console redirect URI

### "No email found in Google account"
- User must have a verified email address with their Google account
- Check Google account settings

### "Failed to complete login"
- Check browser console and server logs for errors
- Verify database migration was applied successfully
- Ensure Prisma client is up to date: `npx prisma generate`

## Production Deployment

1. Update `.env` with production redirect URI:
   ```env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   ```

2. Update Google Console with production redirect URI

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Deploy your application

## API Endpoints

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles Google OAuth callback
- `GET /api/users/{id}` - Returns user data (used for OAuth login completion)

## Database Schema Changes

```prisma
model User {
  // ... existing fields
  password      String?   // Now nullable
  provider      String?   // "google", "auth0", etc
  providerId    String?   // OAuth provider's user ID
  providerImage String?   // Profile image URL
  
  @@unique([provider, providerId], name: "provider_unique")
}
```

## Next Steps

- Consider adding more OAuth providers (Facebook, Twitter, GitHub)
- Implement proper session management with JWT tokens
- Add email verification for OAuth accounts
- Set up rate limiting for OAuth endpoints
- Add OAuth account linking (allow users to connect multiple accounts)

