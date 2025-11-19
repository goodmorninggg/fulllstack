import React, { useState } from 'react'
import { assets } from '../../assets/assets' // Ensure this path is correct

const AddBlog = () => {
  // State variables for controlled inputs
  const [image, setImage] = useState(false); // Stores the uploaded file object
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false); // Likely used for a checkbox/toggle

  const generateContent = async () =>{
  // This function will be called when the "Generate with AI" button is clicked.
  // The 'async' keyword allows you to use 'await' when calling the AI service.
}

const onSubmitHandler = async (e) =>{
  e.preventDefault();
  // This line stops the browser from doing a default page reload on form submission.
  
  // All your form validation and data posting logic will go here.
}
  return (
    <form className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        {/* 1. Image Upload Area */}
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          {/* Displays the preview URL if image is set, otherwise shows the upload placeholder icon */}
          <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" 
          className='mt-2 h-16 rounded cursor-pointer'/>
          
          <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' hidden required/>
        </label>

        {/* 2. Blog Title Input */}
        <p className='mt-4'>Blog title</p>
        <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
        onChange={(e) => setTitle(e.target.value)} value={title}/>

        {/* 3. Blog Subtitle Input */}
        <p className='mt-4'>Sub title</p>
        <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
        onChange={(e) => setSubTitle(e.target.value)} value={subTitle}/>

        {/* 4. Blog Description Area (Placeholder for Rich Text Editor/Textarea) */}
        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          
          {/* AI Generation Button */}
          <button type='button' onClick={generateContent} className='absolute 
          bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded 
          hover:underline cursor-pointer'>Generate with AI</button>
          
          {/* Note: The main textarea/rich text editor input would go above the button */}
        </div>

      </div>
    </form>
  )
}

export default AddBlog;