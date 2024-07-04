import { useEffect } from "react";
import Blog from "../components/Blog";
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import { useSelector, useDispatch } from "react-redux";
import { initializeBlogs } from "../store/blogsSlice";

const Blogs = ({
  blogFormRef,
  handleNewBlog,
  handleDelete,
  handleUpdate,
}) => {
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(initializeBlogs());
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <div>
      <Togglable
        data-testid="blog-form-togglable"
        openLabel="new blog"
        closeLabel="cancel"
        ref={blogFormRef}
      >
        <BlogForm handleNewBlog={handleNewBlog} />
      </Togglable>
      <div data-testid="blog-list">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            currentUser={user.username}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
