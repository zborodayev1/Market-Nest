import mongoose from "mongoose";

const ProductShema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
      default: '',
    },
    price: {
      type: String,
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    }, 
    _id: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Product", ProductShema);