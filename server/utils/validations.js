import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must be longer than 8 characters").isLength({ min: 8 }),
  body("fullName", "Name must be longer than 3 characters").isLength({ min: 3 }),
  body("avatarUrl", "Invalid URL").optional().isURL(),
];

export const loginValidation = [
  body("email", "Invalid email").isEmail(),
  body("password", "Password must be longer than 8 characters").isLength({ min: 8 }),
];

export const productValidation = [
  body("price", "Invalid price").isString(),
  body("tags", "Invalid tags").isArray(),
  body("text", "Text must be longer than 8 characters").isLength({ min: 5 }),
  body("image", "Invalid URL").isString(),
];