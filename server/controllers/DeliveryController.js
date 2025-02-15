import DeliveryModel from '../models/delivery.js'

export const createDelivery = async (req, res) => {
  try {
    const { name, desc, price, time } = req.body

    if (!name || !price || price <= 0 || !time || time <= 0) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, price (> 0), time (> 0)',
      })
    }

    const delivery = await DeliveryModel.create({
      name,
      desc: desc || 'No description',
      price,
      time,
    })

    res.status(201).json({ success: true, delivery })
  } catch (error) {
    console.error('Error during delivery creation:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create delivery',
      error: error.message,
    })
  }
}

export const getDelivery = async (req, res) => {
  try {
    const deliveries = await DeliveryModel.find()

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No deliveries',
      })
    }
    res.set('Cache-Control', 'no-store')
    res.status(200).json({
      deliveries,
      success: true,
    })
  } catch (error) {
    console.error('Error during delivery retrieval:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get deliveries',
      error: error.message,
    })
  }
}
