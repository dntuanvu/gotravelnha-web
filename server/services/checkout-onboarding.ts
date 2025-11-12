import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import prisma from '~/server/utils/prisma'
import { sendEmail } from '~/server/utils/email'

const DEFAULT_PASSWORD = 'P@ssw0rd123'

interface EnsureUserParams {
  email: string
  name?: string | null
  bookingId?: string
}

interface EnsureUserResult {
  userId: string
  newlyCreated: boolean
}

const sanitizeUsername = (input: string) => {
  const trimmed = input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const normalized = trimmed.replace(/^-+|-+$/g, '')
  return normalized.length > 0 ? normalized : `user-${Date.now().toString(36)}`
}

const generateUniqueUsername = async (base: string) => {
  let candidate = base
  let suffix = 1

  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

const splitName = (name?: string | null) => {
  if (!name) return { firstName: null, lastName: null }
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return { firstName: null, lastName: null }
  if (parts.length === 1) return { firstName: parts[0], lastName: null }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  }
}

const issuePasswordReset = async (userId: string, email: string, context: { name?: string | null; bookingId?: string }) => {
  const config = useRuntimeConfig()
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

  await prisma.user.update({
    where: { id: userId },
    data: {
      resetToken,
      resetTokenExpires
    }
  })

  const siteUrl = config.public?.siteUrl || config.BASE_URL || 'https://gotravelnha.com'
  const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`

  const firstName = context.name ? context.name.split(' ')[0] : 'there'
  const bookingInfo = context.bookingId
    ? `<p style="font-size:14px;color:#555;">Booking reference: <strong>${context.bookingId}</strong></p>`
    : ''

  try {
    await sendEmail({
      to: email,
      subject: 'Complete Your GoVietHub Account',
      html: `
      <h2 style="font-family:sans-serif;">Welcome to GoVietHub!</h2>
      <p style="font-family:sans-serif; font-size:15px;">Hi ${firstName},</p>
      <p style="font-family:sans-serif; font-size:15px;">
        Thanks for booking with us. We've created a GoVietHub account for you so you can track future orders and unlock upcoming features.
      </p>
      ${bookingInfo}
      <p style="font-family:sans-serif; font-size:15px;">
        Click the button below to set your password and finish activating your account:
      </p>
      <p style="text-align:center; margin:24px 0;">
        <a href="${resetUrl}" style="background:#10b981;color:#fff;padding:12px 32px;border-radius:8px;font-weight:600;font-family:sans-serif;text-decoration:none;">
          Set My Password
        </a>
      </p>
      <p style="font-family:sans-serif; font-size:13px; color:#666;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p style="font-family:sans-serif; font-size:12px; color:#7c7c7c;">This link will expire in 24 hours.</p>
      <p style="font-family:sans-serif; font-size:13px; color:#555;">— The GoVietHub Team</p>
    `
    })
  } catch (emailError) {
    console.error('[checkout-onboarding] Failed to send password setup email:', emailError)
  }
}

export const ensureUserFromCheckout = async ({ email, name, bookingId }: EnsureUserParams): Promise<EnsureUserResult | null> => {
  if (!email) return null

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    // If the existing account has no password (e.g. OAuth only), prompt them to set one.
    if (!existing.password) {
      await issuePasswordReset(existing.id, email, { name, bookingId })
    }
    return { userId: existing.id, newlyCreated: false }
  }

  const emailUsername = sanitizeUsername(email.split('@')[0])
  const username = await generateUniqueUsername(emailUsername)
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
  const { firstName, lastName } = splitName(name)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      role: 'USER',
      isActive: true
    }
  })

  await issuePasswordReset(user.id, email, { name, bookingId })

  return { userId: user.id, newlyCreated: true }
}
