import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogsService";

export const initializeBlogs = () => {
  return async (dispatch) => {
    const response = await blogService.getAll();
    dispatch(setBlogs(response));
  };
};

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    // Return blogs in descending order
    setBlogs: (state, action) => {
      return [...(state = action.payload)].sort((a, b) => b.likes - a.likes);
    },
    addBlog: (state, action) => {
      return (state = [...state, action.payload]);
    },
    // Find blog with id
    // Update found blog's likes
    // Return blogs in descending order
    handleBlogLikes: (state, action) => {
      const blogToUpdate = state.find((blog) => blog.id === action.payload);
      if (blogToUpdate) {
        const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
        return [
          ...state.map((blog) =>
            blog.id === action.payload ? updatedBlog : blog
          ),
        ].sort((a, b) => b.likes - a.likes);
      }
      return state;
    },
  },
});

export const { setBlogs, addBlog, handleBlogLikes } = blogSlice.actions;
export default blogSlice.reducer;
