import nodemailer from 'nodemailer'

import dotenv from 'dotenv'

dotenv.config()

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secureConnection: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
})

export const sendVerificationCode = async (email, code) => {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    }

    await transporter.sendMail(mailOptions)

    console.log(`Verification code sent successfully to ${email}`)
  } catch (error) {
    console.error('Failed to send verification code:', error)
    throw new Error('Failed to send verification code')
  }
}
