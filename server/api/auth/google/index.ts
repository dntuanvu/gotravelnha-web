import { defineEventHandler, getQuery } from 'h3'
import { OAuth2Client } from 'google-auth-library'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      message: 'Google OAuth credentials not configured'
    })
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    prompt: 'consent',
    state: query.redirect || '/user' // Store redirect destination
  })

  // Redirect to Google
  return sendRedirect(event, authUrl)
})

