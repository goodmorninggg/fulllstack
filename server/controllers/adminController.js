import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to get ALL blogs (published and unpublished) for the Admin Dashboard
export const getAllBlogsAdmin = async (req, res) => {
  try {
    // Find all blogs and sort by creation date, newest first
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to get ALL comments for the Admin Dashboard
export const getAllComments = async (req, res) => {
  try {
    // Find all comments, 'populate' the linked 'blog' document,
    // and sort by creation date, newest first
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getDashboard = async (req, res) => {
  try {
    // 1. Get the 5 most recent blogs
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);

    // 2. Count total blogs (published + drafts)
    const blogs = await Blog.countDocuments();

    // 3. Count total comments
    const comments = await Comment.countDocuments();

    // 4. Count total drafts (unpublished blogs)
    const drafts = await Blog.countDocuments({ isPublished: false });

    // Combine all data into a single object
    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Function to delete a comment by its ID (Admin action)
export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body; // Expects the comment ID in the request body

    // Find the comment and remove it from the database
    await Comment.findByIdAndDelete(id);

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Function to approve a comment by its ID (Admin action)
export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body; // Expects the comment ID in the request body

    // Find the comment by ID and update the 'isApproved' field to true
    await Comment.findByIdAndUpdate(id, { isApproved: true });

    // NOTE: The success message in the image says "Comment deleted successfully"
    // but this function *approves* it. I'll use the correct message below.
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
