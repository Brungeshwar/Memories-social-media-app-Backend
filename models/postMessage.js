import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  name: String,
  creator: String,
  title: String,
  message: String,
  tags: [String],
  selectedFile: String,
  likeCount: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
const PostMessage = mongoose.model("PostMessage", postSchema);
export default PostMessage;
