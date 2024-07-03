import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";
import blogReducer from "./blogsSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
});
