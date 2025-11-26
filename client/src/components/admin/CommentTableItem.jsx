import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      // Send POST request to approve the comment
      // Payload includes the comment ID ('_id' from the current scope)
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });

      if (data.success) {
        toast.success(data.message);
        // Refresh the list to show the updated status
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteComment = async () => {
    try {
      // 1. Ask for confirmation before deleting
      const confirm = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (!confirm) return; // Stop if user cancels

      // 2. Send POST request to delete the comment
      // Payload includes the comment ID ('_id' from the current scope)
      const { data } = await axios.post("/api/admin/delete-comment", {
        id: _id,
      });

      if (data.success) {
        toast.success(data.message);
        // 3. Refresh the list of comments to reflect the deletion
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Handle errors
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog:</b> {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name:</b> {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment:</b> {comment.content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {/* Conditional Logic: Show Tick Button OR Approved Label */}
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
              alt=""
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}

          {/* Delete Icon */}
          <img onClick={deleteComment}
            src={assets.bin_icon}
            alt=""
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
