import { useEffect, useState } from "react"
import axios from "axios";
import { BackendUrl } from "../config";


export interface Blog {
    "content": string;
    "title": string;
    "id": string;
    "author": {
        "name": string
    }
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BackendUrl}/api/v1/blog/search/${id}`, {
            headers: {
                Authorization: localStorage.getItem("jwt")
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    
    
    useEffect(() => {
        axios.get(`${BackendUrl}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("jwt")
            }
        })
        .then(response => {
            setBlogs(response.data.blogs);
            console.log(blogs)
                setLoading(false);
            })
    }, [])

    return {
        loading,
        blogs
    }
}