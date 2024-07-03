import { useState, useEffect, useRef } from "react";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogsService";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./store/notificationSlice";
import { addBlog, initializeBlogs, setBlogs } from "./store/blogsSlice";
import { setUser } from "./store/userSlice";

const App = () => {
  // const [user, setUser] = useState(null);
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);
  const errorMessage = useSelector((state) => state.notification.message);
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  // Check if user state can be found from local storage
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setNotification({ message: "", severity: "" }));
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch, errorMessage]);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      dispatch(setUser(user));
    } catch (error) {
      dispatch(setNotification({ severity: "error", message: "Login failed" }));
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(initializeBlogs());
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleNewBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(newBlog);
      dispatch(addBlog(response));

      dispatch(
        setNotification({
          message: `a new blog ${newBlog.title} added succesfully`,
          severity: "success",
        })
      );
      dispatch(initializeBlogs());
    } catch (error) {
      console.error(error);
      dispatch(
        setNotification({
          message: "Adding new blog failed",
          severity: "error",
        })
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const blogToDelete = blogs.find((blog) => blog.id === id);
      await blogService.deleteBlog(id);
      const filteredBlogs = blogs.filter((blog) => blog.id !== id);
      dispatch(setBlogs(filteredBlogs));
      dispatch(
        setNotification({
          message: `removed ${blogToDelete.title}`,
          severity: "success",
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedBlog) => {
    try {
      await blogService.update(updatedBlog);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    window.localStorage.removeItem("loggedBlogappUser");
  };

  if (user === null) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
      </>
    );
  }

  if (user) {
    return (
      <div>
        <div>
          <h2 data-testid="blogs-header">blogs</h2>
          <Notification />
        </div>
        <div>
          {user.username} logged in
          <button onClick={handleLogout}>Logout</button>
        </div>
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
  }
};

export default App;
