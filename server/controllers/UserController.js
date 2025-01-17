/* eslint-disable @typescript-eslint/no-unused-vars */
import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UnverifiedUserModel from '../models/unverified_user.js'
import { generateVerificationCode } from '../utils/functions/generateVerificationCode.js'
import { sendVerificationCode } from '../utils/functions/sendMailToClient.js'
import { UserEditDataModel } from '../models/editUserData.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 15

export const temporaryRegister = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, city, country } =
      req.body

    const existingTempUser = await UnverifiedUserModel.findOne({ email })
    if (existingTempUser) {
      return res
        .status(400)
        .json({ message: 'Verification email already sent' })
    }

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' })
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    const verificationCode = generateVerificationCode()

    const doc = new UnverifiedUserModel({
      _id: new mongoose.Types.ObjectId(),
      fullName,
      email,
      passwordHash: hash,
      phone,
      address,
      city,
      country,
      verificationCode,
    })

    await doc.save()

    // await sendVerificationCode(email, verificationCode)

    res.status(201).json({
      message: 'Verification email sent. Please verify your email.',
      email: doc.email,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to initiate registration' })
  }
}

export const completeRegistration = async (req, res) => {
  try {
    const { email, code } = req.body

    const tempUser = await UnverifiedUserModel.findOne({ email })
    if (!tempUser) {
      return res
        .status(404)
        .json({ message: 'User not found or already registered' })
    }

    if (tempUser.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    const userDoc = new UserModel({
      _id: tempUser._id,
      fullName: tempUser.fullName,
      email: tempUser.email,
      avatarUrl: tempUser.avatarUrl,
      address: tempUser.address,
      city: tempUser.city,
      country: tempUser.country,
      passwordHash: tempUser.passwordHash,
      phone: tempUser.phone,
    })

    const user = await userDoc.save()

    await UnverifiedUserModel.deleteOne({ _id: tempUser._id })

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '90d',
    })

    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      token,
      message: 'Registration completed successfully!',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to complete registration' })
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

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
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

export const requestPasswordChangeWEmail = async (req, res) => {
  try {
    let userEditData = await UserEditDataModel.findOne({ userId: req.userId })

    if (!userEditData) {
      userEditData = new UserEditDataModel({ userId: req.userId })
      await userEditData.save()
    }

    const { newPassword } = req.body

    if (userEditData.passwordChangeVerificationCode) {
      return res
        .status(400)
        .json({ message: 'Password change code already sent' })
    }

    const verificationCode = generateVerificationCode()
    userEditData.passwordChangeVerificationCode = verificationCode
    userEditData.newPassword = newPassword
    await userEditData.save()

    // await sendVerificationCode(user.email, verificationCode)

    res.json({ message: 'Verification code sent to your email, if it exists.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to send verification code' })
  }
}

export const confirmPasswordChangeWEmail = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    let userEditData = await UserEditDataModel.findOne({ userId: req.userId })

    if (!userEditData) {
      userEditData = new UserEditDataModel({ userId: req.userId })
      await userEditData.save()
    }

    const { verificationCode } = req.body

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (userEditData.passwordChangeVerificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(userEditData.newPassword, salt)

    user.password = hashedPassword

    userEditData.passwordChangeVerificationCode = ''
    userEditData.newPassword = ''

    await userEditData.save()
    await user.save()

    res.json({ message: 'Password successfully updated.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to update password' })
  }
}

export const patchProfilePhone = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
    const { password, phone } = req.body

    const isValidPass = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPass) {
      return res.status(400).json({ message: 'Invalid password' })
    }
    const updateData = {
      phone,
    }

    await UserModel.updateOne({ _id: req.userId }, updateData)
    res.json({ user: updateData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to change phone' })
  }
}

export const requestPhoneChangeWEmail = async (req, res) => {
  try {
    let userEditData = await UserEditDataModel.findOne({ userId: req.userId })

    if (!userEditData) {
      userEditData = new UserEditDataModel({ userId: req.userId })
      await userEditData.save()
    }
    const { newPhone } = req.body

    if (!newPhone) {
      return res.status(400).json({ message: 'New phone number is required' })
    }

    const verificationCode = generateVerificationCode()

    userEditData.phoneChangeVerificationCode = verificationCode
    userEditData.newPhone = newPhone

    await userEditData.save()

    // await sendVerificationCode(user.email, verificationCode)

    res.json({ message: 'Verification code sent to your email, if it exists.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to send verification code' })
  }
}

export const confirmPhoneChangeWEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body

    const user = await UserModel.findOne(req.userId)
    let userEditData = await UserEditDataModel.findOne({ userId: req.userId })

    if (!userEditData) {
      userEditData = new UserEditDataModel({ userId: req.userId })
      await userEditData.save()
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (userEditData.phoneChangeVerificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    user.phone = userEditData.newPhone
    userEditData.newPhone = ''
    userEditData.phoneChangeVerificationCode = ''

    await userEditData.save()
    await user.save()

    res.json({ message: 'Phone number successfully updated.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to update phone number' })
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    const { passwordHash, email, role, ...userData } = user._doc
    res.json(userData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to get user profile',
    })
  }
}

export const getUserProducts = async (req, res) => {
  try {
    const userId = req.userId

    const products = await ProductModel.find({ user: userId })

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found for this user' })
    }

    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      createdAt: dayjs(product.createdAt).format('YY-MM-DD'),
      updatedAt: dayjs(product.updatedAt).format('YY-MM-DD'),
    }))

    res.json(formattedProducts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}
