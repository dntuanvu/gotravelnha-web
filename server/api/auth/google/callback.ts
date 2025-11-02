import { defineEventHandler, getQuery } from 'h3'
import { OAuth2Client } from 'google-auth-library'
import * as bcrypt from 'bcrypt'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string || '/user'
  const error = query.error as string

  if (error) {
    return sendRedirect(event, `/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return sendRedirect(event, '/login?error=no_code')
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

  if (!clientId || !clientSecret) {
    return sendRedirect(event, '/login?error=oauth_not_configured')
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.id_token) {
      throw new Error('No ID token received')
    }

    // Verify and get user info
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId
    })

    const payload = ticket.getPayload()
    
    if (!payload) {
      throw new Error('No payload received')
    }

    // Extract user info
    const googleId = payload.sub
    const email = payload.email
    const firstName = payload.given_name
    const lastName = payload.family_name
    const profileImage = payload.picture

    if (!email) {
      throw new Error('No email found in Google account')
    }

    // Check if user exists by email or Google ID
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { provider: 'google', providerId: googleId }
        ]
      }
    })

    if (user) {
      // Update existing user with Google info if needed
      if (!user.provider || !user.providerId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: 'google',
            providerId: googleId,
            providerImage: profileImage,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName
          }
        })
      }
    } else {
      // Create new user
      // Generate a random password hash for OAuth users
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10)
      
      // Create username from email (remove domain)
      const usernameBase = email.split('@')[0]
      let username = usernameBase
      let counter = 1
      
      // Ensure username is unique
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${usernameBase}${counter}`
        counter++
      }

      user = await prisma.user.create({
        data: {
          email,
          username,
          password: randomPassword, // OAuth users don't need real password
          firstName,
          lastName,
          provider: 'google',
          providerId: googleId,
          providerImage: profileImage,
          role: 'USER',
          isActive: true
        }
      })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    // Set session/cookie (you may want to use a proper session library)
    setCookie(event, 'auth_token', user.id, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    // Redirect based on state (which page they came from)
    const redirectTo = state === '/admin' ? '/admin' : '/user'
    
    // For now, just redirect to login success page with user data
    // In production, you'd set a proper session and redirect
    return sendRedirect(event, `/login?success=true&userId=${user.id}`)
    
  } catch (err: any) {
    console.error('Google OAuth error:', err)
    return sendRedirect(event, `/login?error=${encodeURIComponent(err.message)}`)
  }
})

