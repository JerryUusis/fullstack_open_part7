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
    setBlogs: (state, action) => {
      return (state = action.payload);
    },
    addBlog: (state, action) => {
      return (state = [...state, action.payload]);
    },
  },
});

export const { setBlogs, addBlog } = blogSlice.actions;
export default blogSlice.reducer;
