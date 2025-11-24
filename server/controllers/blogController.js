import fs from "fs";
import imagekit from "../configs/imageKits.js";
import Blog from "../models/Blog.js";
import mongoose from "mongoose";

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
      urlEndpoint: "https://ik.imagekit.io/brightbits",
      transformation: [
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // Convert to modern format
        { width: "1280" }, // Width resizing
      ],
    });
    console.log(optimizedImageUrl);

    const image = optimizedImageUrl; // Final image URL to save in DB

    // Save blog post to MongoDB (Blog model must be imported)
    const data= await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    // Success Response
    res.json({ success: true, message: "Blog added successfully",data });
  } catch (error) {
    // Error Response
    res.json({ success: false, message: error.message });
  }
};
