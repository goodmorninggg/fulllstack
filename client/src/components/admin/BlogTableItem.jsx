import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import {toast} from "react-hot-toast";
// import {toast} from 'react-hot-toast';

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const deleteBlog = async () => {
    // 1. Ask for confirmation before deleting
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirm) return; // Stop if user cancels

    try {
      // 2. Send POST request to delete the blog
      // Note: Using POST for delete is possible but DELETE method is more RESTful
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });

      if (data.success) {
        toast.success(data.message);
        // 3. Refresh the list of blogs after deletion
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Handle errors
      toast.error(error.message);
    }
  };
  const togglePublish = async () => {
    try {
      // Send POST request to toggle the publish status
      // Sending { id: blog._id } in the request body
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,})

      if (data.success) {
        toast.success(data.message);
        // Refresh the list of blogs to reflect the updated status
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Handle any network or server errors
      toast.error(error.message);
    }
  }

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4"> {title} </td>
      <td className="px-2 py-4 max-sm:hidden"> {BlogDate.toDateString()} </td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button
          onClick={togglePublish}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <img
          src={assets.cross_icon}
          className="w-8 hover:scale-110 transition-all
      cursor-pointer"
          alt=""
          onClick={deleteBlog}
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
