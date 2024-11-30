import MainModel from "../models/main.js";

const updateSetting = async (req, res, field, value) => {
  try {
    await MainModel.updateOne({ _id: req.userId }, { [field]: value });
    res.json({
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} changed successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Failed to update ${field}` });
  }
};

const validateField = (res, fieldName, fieldValue) => {
  if (!fieldValue) {
    res
      .status(400)
      .json({
        message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
      });
    return false;
  }
  return true;
};

export const setLanguage = async (req, res) => {
  const { language } = req.body;
  if (!validateField(res, "language", language)) return;
  await updateSetting(req, res, "language", language);
};

export const setCurrency = async (req, res) => {
  const { currency } = req.body;
  if (!validateField(res, "currency", currency)) return;
  await updateSetting(req, res, "currency", currency);
};
