import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";
export const getPosts = async (req, res, next) => {
  const { page } = req.query;
  //console.log(page);
  const limit = 6;
  const total = await PostMessage.countDocuments({});
  const startIndex = (page - 1) * limit;

  try {
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  //console.log("post");
  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId, //its added by the backend
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such workout" });
  }

  const post = await PostMessage.findOneAndDelete({ _id: id });

  if (!post) {
    return res.status(400).json({ error: "No such workout" });
  }

  res.status(200).json(post);
};

// update a workout
export const updatePost = async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  let response = await PostMessage.findByIdAndUpdate(id, updatedPost, {
    new: true,
  });
  //console.log("updated request");
  res.json(response);
};
export const updatelikes = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    //to check whether the user is authorised or not
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likeCount.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likeCount.push(req.userId);
  } else {
    post.likeCount = post.likeCount.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.status(200).json(updatedPost);
};

/*
export const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such workout" });
  }

  const post = await PostMessage.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!post) {
    return res.status(400).json({ error: "No such posts" });
  }

  res.status(200).json(post);
};
*/

export const getPostsBySearch = async (req, res) => {
  //console.log(req);
  let { searchQuery, tags } = req.query;
  if (!searchQuery) searchQuery = "none";
  if (!tags) tags = "none";
  //console.log(searchQuery);

  try {
    const title = new RegExp(searchQuery, "i");
    //console.log(title);

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    //console.log(posts);
    res.json(posts);
  } catch (error) {
    //console.log(error);
    res.status(404).json({ message: error.message });
  }
};
