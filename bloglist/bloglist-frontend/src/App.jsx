import { useState, useEffect, useRef } from "react";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [severity, setSeverity] = useState("");

  const blogFormRef = useRef();

  // Fetch blogs and save in the blogs state
  const fetchData = async () => {
    const request = await blogService.getAll();
    setBlogs(request);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Check if user state can be found from local storage
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage]);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      handleNotification("Login failed", "error");
      console.error(error);
    }
  };

  const handleNotification = (message, severity) => {
    setErrorMessage(message);
    setSeverity(severity);
  };

  const handleNewBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      await blogService.create(newBlog);
      handleNotification(
        `a new blog ${newBlog.title} added succesfully`,
        "success"
      );
      await fetchData();
    } catch (error) {
      console.error(error);
      handleNotification("Adding new blog failed", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id);
      const filteredBlogs = blogs.filter((blog) => blog.id !== id);
      setBlogs(filteredBlogs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (updatedBlog) => {
    try {
      await blogService.update(updatedBlog);
    }
    catch(error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  if (user === null) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification errorMessage={errorMessage} severity={severity} />
        <LoginForm handleLogin={handleLogin} />
      </>
    );
  }

  if (user) {
    return (
      <div>
        <div>
          <h2 data-testid="blogs-header">blogs</h2>
          <Notification errorMessage={errorMessage} severity={severity} />
        </div>
        <div>
          {user.username} logged in
          <button onClick={handleLogout}>Logout</button>
        </div>
        <Togglable data-testid="blog-form-togglable" openLabel="new blog" closeLabel="cancel" ref={blogFormRef}>
          <BlogForm handleNewBlog={handleNewBlog} />
        </Togglable>
        <div data-testid="blog-list">
          {blogs
            // Sort in descending order
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
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
