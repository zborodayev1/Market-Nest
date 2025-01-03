import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

export const verifyTokenForWS = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { userId: decoded._id }
  } catch (err) {
    throw new Error(err.message)
  }
}
