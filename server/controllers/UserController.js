import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 15

export const register = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '90d',
    })

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to register user',
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    )

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Wrong password',
      })
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '90d',
    })

    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to login user',
    })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get user profile',
    })
  }
}

export const patchProfileData = async (req, res) => {
  try {
    const updateData = {
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      phone: req.body.phone,
      fullName: req.body.fullName,
    }
    await UserModel.updateOne({ _id: req.userId }, updateData)
    res.json({ user: updateData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to change profile' })
  }
}

export const patchProfileEmail = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    const { email, password } = req.body

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isValidPass = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPass) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const updateData = {
      email,
    }

    await UserModel.updateOne({ _id: req.userId }, updateData)
    res.json({ user: updateData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to change profile' })
  }
}

export const patchProfilePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { oldPassword, password } = req.body

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 6 characters long' })
    }

    const isValidPass = await bcrypt.compare(oldPassword, user.passwordHash)
    if (!isValidPass) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    await UserModel.updateOne(
      { _id: req.userId },
      { passwordHash: passwordHash }
    )

    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to change password' })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    const { passwordHash, ...userData } = user._doc
    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get user profile',
    })
  }
}
