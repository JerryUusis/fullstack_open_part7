import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleBlogLikes } from "../store/blogsSlice";

const BlogsSingle = ({ handleUpdate }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const params = useParams();
  const blog = blogs.find((b) => b.id === params.id);
  if (!blog) {
    return null;
  }
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
      </div>
    </>
  );
};

export default BlogsSingle;
