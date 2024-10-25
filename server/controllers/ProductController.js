import mongoose from "mongoose";
import ProductModel from "../models/product.js";
import CommentsModel from "../models/coments.js";

export const createProduct = async (req, res) => {
    try {
        const doc = new ProductModel({
            _id: new mongoose.Types.ObjectId(),
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId,
            image: req.body.image,
            price: req.body.price
        });
        if(!doc){
            return res.status(400).json({
                message: "Failed to create product",
            });
        }
        const product = await doc.save();

        if(!product){
            return res.status(400).json({
                message: "Failed to create product",
            });
        }
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to create product",
        });
    }
}
export const getOneProduct = (req, res) => {
    const productId = req.params.id;

    ProductModel.findOneAndUpdate(
      {
        _id: productId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Product not found",
          });
        }
  
        res.json({ doc });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Failed to get product",
        });
      });
};
export const patchProduct = async (req, res) => {
    try {
        const product = await ProductModel.updateOne(
            { _id: req.params.id },
            {
                text: req.body.text,
                tags: req.body.tags,
                image: req.body.image,
                price: req.body.price
            },
          );
          res.json({ message: "Product changed" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to change product",
        });
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const product = await ProductModel.deleteOne({ _id: req.params.id });
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to delete product",
        });
    }
}
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get products",
        });
    }
}
