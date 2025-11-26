import fs from "fs";
import imagekit from "../configs/imageKits.js";
import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";


export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    // Check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    console.log(imageFile.path);
    const fileBuffer = fs.createReadStream(imageFile.path);

    // Upload Image to ImageKit
    const response = await imagekit.files.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });
    // console.log(response);

    // optimization through imagekit URL transformation
    const optimizedImageUrl = imagekit.helper.buildSrc({
      src: response.filePath,
      urlEndpoint: "http://ik.imagekit.io/brightbits",
      transformation: [
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // Convert to modern format
        { width: "1280" }, // Width resizing
      ],
    });
    console.log(optimizedImageUrl);

    const image = optimizedImageUrl; // Final image URL to save in DB

    // Save blog post to MongoDB (Blog model must be imported)
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    // Success Response
    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    // Error Response
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    // Only return blogs where isPublished is true
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 2. GET SINGLE BLOG BY ID (For Detail Page)
export const getBlogById = async (req, res) => {
  try {
    // Assuming blogId is correctly extracted from the request (e.g., req.params or req.body)
    const { blogId } = req.params; // Note: req.parse is unusual; typically it would be req.params or req.body

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 3. DELETE BLOG BY ID (Admin Function)
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body; // Expects ID in the request body
    await Blog.findByIdAndDelete(id);
     
     //delete all comments associated with the blog
     await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 4. TOGGLE PUBLISH STATUS (Admin Function)
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body; // Expects ID in the request body

    // Find the blog post
    const blog = await Blog.findById(id);

    // Toggle the boolean value
    blog.isPublished = !blog.isPublished;

    // Save the updated blog post back to the database
    await blog.save();

    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: 'Comment added for review' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        
        // Find comments associated with blogId, ensure they are approved, and sort by newest first
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        
        res.json({ success: true, comments });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Appends a specific instruction to ensure the AI returns simple text suitable for a blog
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
        
        res.json({ success: true, content });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}