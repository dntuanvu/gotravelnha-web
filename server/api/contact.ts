import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: 'sinult3.hostarmada.net',
    port: 465,
    secure: true, // SSL for 465
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  })

  await transporter.sendMail({
    from: body.email, // 📬 sender is the user
    to: `"Trip Affiliate Contact" <${config.SMTP_USER}>`,
    replyTo: body.email, // ✅ so replies go back to user
    subject: `New Contact Message from ${body.name}`,
    text: body.message,
    html: `
      <p><strong>From:</strong> ${body.name} (${body.email})</p>
      <p>${body.message}</p>
    `
  })

  return { success: true }
})
