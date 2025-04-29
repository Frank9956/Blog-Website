import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Category slug is required"],
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: false, // Optional (not mandatory)
    trim: true,
  },
}, { timestamps: true });

// If already compiled, use the existing model (important for Next.js hot reloading)
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
