import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleBlogLikes } from "../store/blogsSlice";
import blogsService from "../services/blogsService";
import { useState, useEffect } from "react";

const BlogsSingle = ({ handleUpdate }) => {
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const params = useParams();
  const blog = blogs.find((b) => b.id === params.id);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await blogsService.getComments();
      setComments(response);
    };
    fetchComments();
  }, []);

  // Filter comments with blog id
  const filterComments = (commentsArray, id) => {
    return commentsArray.filter((comment) => comment.id === id);
  };

  const updateBlog = async () => {
    try {
      const newLikes = blog.likes + 1;
      const updatedBlog = {
        id: blog.id,
        user: blog.user.id,
        likes: newLikes,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      };
      handleUpdate(updatedBlog);
      dispatch(handleBlogLikes(blog.id));
    } catch (error) {
      console.error(error);
    }
  };

  if (!blog) {
    return null;
  }

  return (
    <>
      <h2>{blog.title}</h2>
      <p>{blog.url}</p>
      <div data-testid={"blog-likes-div"}>
        likes <span data-testid={"blog-likes"}>{blog.likes}</span>{" "}
        <button onClick={updateBlog} data-testid={"blog-like-button"}>
          like
        </button>
        <p>added by {blog.author}</p>
        <h3>comments</h3>
        <ul>
          {filterComments(comments, blog.id).map((item) => (
            <li key={item.comment}>{item.comment}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default BlogsSingle;
