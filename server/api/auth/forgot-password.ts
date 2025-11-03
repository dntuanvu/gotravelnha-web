import { defineEventHandler, readBody } from 'h3'
import * as crypto from 'crypto'
import * as nodemailer from 'nodemailer'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({
        statusCode: 400,
        message: 'Email is required'
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Don't reveal if email exists (security best practice)
    // Always return success message
    if (!user) {
      return {
        success: true,
        message: 'If an account exists with this email, reset instructions have been sent.'
      }
    }

    // Check if user has a password (not OAuth-only)
    if (!user.password) {
      return {
        success: true,
        message: 'If an account exists with this email, reset instructions have been sent.'
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date()
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1) // Token expires in 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    })

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Create reset URL
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Send email
    const mailOptions = {
      from: `GoVietHub <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Password - GoVietHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔐 Password Reset</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We received a request to reset your password for your GoVietHub account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Or copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999;">
              This link will expire in 1 hour for security reasons.<br>
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              Happy travels! ✈️<br>
              The GoVietHub Team
            </p>
          </div>
        </body>
        </html>
      `
    }

    await transporter.sendMail(mailOptions)

    // Don't reveal if email exists - always return success
    return {
      success: true,
      message: 'If an account exists with this email, reset instructions have been sent.'
    }
  } catch (error: any) {
    console.error('Forgot password error:', error)
    
    // Still return success to prevent email enumeration
    return {
      success: true,
      message: 'If an account exists with this email, reset instructions have been sent.'
    }
  }
})

