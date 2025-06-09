import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (!body.name || !body.email || !body.amount || !body.converted) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  const transporter = nodemailer.createTransport({
    host: 'sinult3.hostarmada.net',
    port: 465, // or 587 if TLS
    secure: true, // true = SSL (465), false = TLS (587)
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    }
})

  await transporter.sendMail({
    from: `noreply@enjoytravelsingapore.com`,
    to: 'sales@enjoytravelsingapore.com',
    subject: `Currency Exchange Request (${body.direction})`,
    html: `
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Direction:</strong> ${body.direction}</p>
      <p><strong>Amount:</strong> ${body.amount}</p>
      <p><strong>Converted:</strong> ${body.converted}</p>
    `
  })

  return { success: true }
})