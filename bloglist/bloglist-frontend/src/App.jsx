import { useEffect, useRef } from "react";
import blogService from "./services/blogsService";
import loginService from "./services/login";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./store/notificationSlice";
import { addBlog, initializeBlogs, setBlogs } from "./store/blogsSlice";
import { setUser } from "./store/userSlice";
import { Routes, Route, useNavigate } from "react-router-dom";
import UsersPage from "./routes/UsersPage";
import Login from "./components/LoginForm";
import Blogs from "./routes/Blogs";
import Root from "./routes/Root";
import UserSingle from "./routes/UserSingle";

const App = () => {
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);
  const errorMessage = useSelector((state) => state.notification.message);
  const dispatch = useDispatch();
  const blogFormRef = useRef();
  const navigate = useNavigate();

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
      navigate("/blogs");
    } catch (error) {
      dispatch(setNotification({ severity: "error", message: "Login failed" }));
      console.error(error);
    }
  };

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
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Root handleLogout={handleLogout} user={user} />}
      >
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route
          path="/blogs"
          element={
            <Blogs
              blogFormRef={blogFormRef}
              handleNewBlog={handleNewBlog}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          }
        />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserSingle />} />
      </Route>
    </Routes>
  );
};

export default App;
