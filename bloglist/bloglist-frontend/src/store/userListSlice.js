import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/userService";

const userListSlice = createSlice({
  name: "userList",
  initialState: [],
  reducers: {
    setUserList: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const initializeUserList = () => {
  return async (dispatch) => {
    const response = await userService.getAll();
    dispatch(setUserList(response));
  };
};

export const { setUserList } = userListSlice.actions;
export default userListSlice.reducer;
