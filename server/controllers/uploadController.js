import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import UserModel from '../models/user.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const filePath = `/uploads/${req.file.filename}`
    const fullPath = path.join(__dirname, '..', 'public', filePath)

    try {
      await fs.access(fullPath)

      const newUser = await UserModel.create({
        avatarUrl: filePath,
      })

      return res.json({
        success: true,
        message: 'Файл уже существует, создан новый пользователь',
        user: newUser,
      })
    } catch {}

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { avatarUrl: filePath },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.json({
      success: true,
      message: 'Файл успешно загружен и пользователь обновлен',
      user: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message,
    })
  }
}
