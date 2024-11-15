import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid email!").isEmail(),
  body("password", "Password must be longer than 8 characters!").isLength({ min: 8 }),
  body("fullName", "Name must be longer than 3 characters!").isLength({ min: 3 }),
  body("avatarUrl", "Invalid URL!").optional().isURL(),
];

export const loginValidation = [
  body("email", "Invalid email!").isEmail(),
  body("password", "Password must be longer than 8 characters!").isLength({ min: 8 }),
];

export const productValidation = [
  body("price", "Invalid price, price must be a number!").isFloat(),
  body("tags", "Invalid tags, tags must be an array!").isArray(),
  body("name", "Name must be longer than 3 characters!").isLength({ min: 3 }),
  body("image", "Invalid URL!").isString(),
  body("description", "Description must be longer than 5 characters!").optional().isLength({ min: 5 }),
];