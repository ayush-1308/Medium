
import { Appbar } from "../components/Appbar"
import axios from "axios"
import { BackendUrl } from "../config"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("")

    const navigate = useNavigate();
  return (
    <div>
        <Appbar />
    <div className='flex justify-center pt-10'>
      <div className='max-w-screen-lg w-full'>
        <textarea
          id='message'
          onChange={(e) => setTitle(e.target.value)}
          className='block mb-6 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder='Title...'
        ></textarea>
        <TextEditor onChange={(e) => setContent(e.target.value)}/>
        <button onClick={async () => {
        const response = await axios.post(`${BackendUrl}/api/v1/blog`, {
            title,
            content
        },{
            headers: {
                Authorization: localStorage.getItem("jwt")
            }
        })
        navigate(`/blog/${response.data.id}`)
   }} type="submit" className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
       Publish post
   </button>
      </div>
    </div>
    </div>
  )
}

function TextEditor ({onChange} : {onChange: (e: any) => void}){
    return <>
    
<form>
    <div className="mb-6 bg-white rounded-lg border dark:border-gray-600">
       <div className=" bg-white rounded-b-lg">
           <label htmlFor="editor" className="sr-only">Publish post</label>
           <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0  focus:ring-0 dark:placeholder-gray-400" placeholder="Write an article..." required ></textarea>
       </div>
   </div>
   
</form>
</>
}
