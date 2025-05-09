import mongoose from "mongoose";

const AuthorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Authors name is required"],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  
  description: {
    type: String,
    required: true, 
    trim: true,
  },
}, { timestamps: true });

// If already compiled, use the existing model (important for Next.js hot reloading)
export const Authors = mongoose.models.Authors || mongoose.model("Authors", AuthorsSchema);
export default Authors;
