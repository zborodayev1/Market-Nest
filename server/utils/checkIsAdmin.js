import UserModel from '../models/user.js'

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
      })
    }

    next()
  } catch (error) {
    console.error('Error in isAdmin middleware:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
}
