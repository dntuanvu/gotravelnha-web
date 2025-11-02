import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (!body.eventTitle || !body.name || !body.email || !body.phone || !body.adults) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Check if SMTP credentials are configured
  if (!config.SMTP_USER || !config.SMTP_PASS) {
    console.error('SMTP credentials not configured')
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Email service not configured. Please contact administrator.' 
    })
  }

  // Create transporter without verification for now (verify can cause issues)
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(config.SMTP_PORT as string) || 587,
    secure: true, // SSL for 465
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    },
    debug: true, // Enable debug logging
    logger: true // Log to console
  })

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
        🎫 New Booking Request from GoTravelNha
      </h2>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #166534;">Event Details</h3>
        <p><strong>Event:</strong> ${body.eventTitle}</p>
        <p><strong>Price:</strong> ${body.eventPrice || 'Not specified'}</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #166534;">Customer Information</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${body.phone}">${body.phone}</a></p>
        <p><strong>Number of Adults:</strong> ${body.adults}</p>
        <p><strong>Number of Children:</strong> ${body.children || 0}</p>
      </div>
      
      ${body.notes ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">Additional Notes</h3>
          <p style="white-space: pre-wrap;">${body.notes}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p>This booking request was submitted from <a href="https://gotravelnha.com">GoTravelNha.com</a></p>
        <p>Please respond to the customer within 24 hours.</p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `GoTravelNha <${config.SMTP_USER}>`,
    to: 'enjoytravelticket@gmail.com',
    cc: ['chloenguyenvuthanhtruc@gmail.com', 'sales@gotravelnha.com'],
    replyTo: body.email,
    subject: `🎫 New Booking Request: ${body.eventTitle}`,
    html: emailHtml,
    text: `
New Booking Request from GoTravelNha

Event Details:
- Event: ${body.eventTitle}
- Price: ${body.eventPrice || 'Not specified'}

Customer Information:
- Name: ${body.name}
- Email: ${body.email}
- Phone: ${body.phone}
- Number of Adults: ${body.adults}
- Number of Children: ${body.children || 0}

${body.notes ? `Additional Notes:\n${body.notes}\n` : ''}

---
This booking request was submitted from GoTravelNha.com
Please respond to the customer within 24 hours.
    `.trim()
  })

  return { success: true }
})
