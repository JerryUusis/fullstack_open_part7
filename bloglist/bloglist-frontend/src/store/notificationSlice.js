import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    severity: "",
    message: "",
  },
  reducers: {
    setNotification: (state, action) => {
      state.severity = action.payload.severity;
      state.message = action.payload.message;
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
