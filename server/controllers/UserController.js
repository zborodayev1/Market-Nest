import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(15);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            _id: new mongoose.Types.ObjectId(),
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({ _id: user._id }, "12058080", {
            expiresIn: "90d",
          });
      
          const { passwordHash, ...userData } = user._doc;
      
          res.json({
            ...userData,
            token,
          });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to register user",
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash,
          );
      
          if (!isValidPass) {
            return res.status(400).json({
              message: "Wrong password",
            });
          }

          const token = jwt.sign({ _id: user._id }, "12058080", {
            expiresIn: "90d",
          });

          const { passwordHash, ...userData } = user._doc;


        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to login user",
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get user profile",
        });
    }
}

export const patchPassword = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const isValidPass = await bcrypt.compare(
            req.body.oldPassword,
            user._doc.passwordHash,
          );
      
          if (!isValidPass) {
            return res.status(400).json({
              message: "Wrong password",
            });
          }

          const salt = await bcrypt.genSalt(15);
          const hash = await bcrypt.hash(req.body.newPassword, salt);

          await UserModel.updateOne(
            { _id: req.userId },
            { passwordHash: hash },
          );
          res.json({ message: "Password changed" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to change password",
        });
    }
}
export const patchProfile = async (req, res) => {
    try {
        await UserModel.updateOne(
            { _id: req.userId },
            {
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
            },
          );
          res.json({ message: "Profile changed" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to change profile",
        });
    }
}
export const deleteProfile = async (req, res) => {
    try {
        await UserModel.deleteOne({ _id: req.userId });
        res.json({ message: "Profile deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to delete profile",
        });
    }
}
export const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get user profile",
        });
    }
}