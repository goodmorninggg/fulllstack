import React, { useEffect, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useRef } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";


const AddBlog = () => {
  const {axios} = useAppContext();
  const [isAdding, setIsAdding] = useState(false); 
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // State variables for controlled inputs
  const [image, setImage] = useState(false); // Stores the uploaded file object
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false); // Likely used for a checkbox/toggle

  const generateContent = async () => {
    // This function will be called when the "Generate with AI" button is clicked.
    // The 'async' keyword allows you to use 'await' when calling the AI service.
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsAdding(true); // Start loading state

    try {
        // 1. Prepare the blog data object
        const blog = {
            title,
            subTitle,
            description: quillRef.current.root.innerHTML, // Get rich text HTML
            category,
            isPublished
        };

        // 2. Create FormData to handle file upload along with JSON data
        const formData = new FormData();
        formData.append('blog', JSON.stringify(blog)); // Send object as string
        formData.append('image', image); // Append the file object

        // 3. Send POST request to the backend
        const { data } = await axios.post('/api/blog/add', formData);

        // 4. Handle Success Response
        if (data.success) {
            toast.success(data.message);
            
            // Reset all form states to initial values
            setImage(false);
            setTitle('');
            setSubTitle(''); // Assuming you have this state setter
            quillRef.current.root.innerHTML = ''; // Clear the editor content
            setCategory('Startup'); // Reset category to default
            setIsPublished(true); // Reset publish status
        } else {
            // Handle API-level failure (e.g., validation errors)
            toast.error(data.message);
        }

    } catch (error) {
        // 5. Handle Network/Server Errors
        toast.error(error.message);
        console.error(error); // Good for debugging
    } finally {
        // 6. Stop loading state regardless of success or failure
        setIsAdding(false);
    }
};
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    } // <--- Added missing closing brace for 'if' statement
  }, []); // <--- Added dependency array so it only runs once

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        {/* 1. Image Upload Area */}
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          {/* Displays the preview URL if image is set, otherwise shows the upload placeholder icon */}
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />

          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        {/* 2. Blog Title Input */}
        <p className="mt-4">Blog title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        {/* 3. Blog Subtitle Input */}
        <p className="mt-4">Sub title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        {/* 4. Blog Description Area (Placeholder for Rich Text Editor/Textarea) */}
        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            type="button"
            onClick={generateContent}
            className="absolute 
          bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded 
          hover:underline cursor-pointer"
          >
            Generate with AI
          </button>

          {/* Note: The main textarea/rich text editor input would go above the button */}
        </div>

        <p className="mt-4">Blog category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <div className='flex gap-2 mt-4'>
  <p>Publish Now</p>
  <input type="checkbox" checked={isPublished} className='scale-125
  cursor-pointer' onChange={e => setIsPublished(e.target.checked)}/>
</div>

<button disabled={isAdding} type="submit" className='mt-8 w-40 h-10 bg-primary text-white
rounded cursor-pointer text-sm'>
  {isAdding ? 'Adding Blog...' : 'Add Blog'}
</button>

</div>
</form>

  );
};

export default AddBlog;
