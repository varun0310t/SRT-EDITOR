// userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    Email: string;
    Username: string;
    // Add other user properties as needed
  } | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to log in the user
    login(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        Email: string;
        Username: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload;

      localStorage.setItem("token", "true");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    // Action to log out the user
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
