import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";
import blogReducer from "./blogsSlice";
import userReducer from "./userSlice";
import userListReducer from "./userListSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    userList: userListReducer
  },
});
