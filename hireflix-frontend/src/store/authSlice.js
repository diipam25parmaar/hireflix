// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

const safeParseUser = () => {
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  } catch (e) {
    return null;
  }
};

// Login action
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const res = await API.post("/login", credentials);
      if (res?.data) {
        try {
          if (res.data.token) localStorage.setItem("token", res.data.token);
          if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (e) {}
        return res.data.user;
      }
      return null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || { message: "Login failed" });
    }
  }
);

// Register action
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await API.post("/register", data);
      if (res?.data) {
        try {
          if (res.data.token) localStorage.setItem("token", res.data.token);
          if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (e) {}
        return res.data.user;
      }
      return null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || { message: "Registration failed" });
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, thunkAPI) => {
    try {
      const res = await API.post("/forgot-password", { email: payload.email });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || { message: "Failed to request reset token" });
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, thunkAPI) => {
    try {
      const res = await API.post("/reset-password", payload);
      if (res?.data) {
        try {
          if (res.data.token) localStorage.setItem("token", res.data.token);
          if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (e) {}
        return res.data.user;
      }
      return null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || { message: "Failed to reset password" });
    }
  }
);

const initialState = {
  user: safeParseUser(),
  loading: false,
  error: null,
  offlineResetToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearOfflineResetToken: (state) => {
      state.offlineResetToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.offlineResetToken = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.offlineResetToken = action.payload?.token ?? null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to request reset token";
      })

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.offlineResetToken = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reset password";
      });
  },
});

export const { logout, clearAuthError, clearOfflineResetToken } = authSlice.actions;
export default authSlice.reducer;
