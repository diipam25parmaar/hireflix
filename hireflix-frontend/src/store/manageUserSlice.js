// store/manageUserSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

// Thunks
export const fetchUsers = createAsyncThunk(
  "manageUser/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/users");
      return res?.data ?? [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "manageUser/createUser",
  async (data, thunkAPI) => {
    try {
      // expect data to be an object; if it contains `id` (from form), remove it
      const payload = { ...data };
      if (payload.hasOwnProperty("id")) delete payload.id;
      const res = await API.post("/users", payload);
      return res?.data ?? null;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "manageUser/updateUser",
  async (payload, thunkAPI) => {
    try {
      // support two shapes:
      // 1) payload = { id, data } (preferred)
      // 2) payload = { id, name, email, role, password } (form object)
      if (!payload) {
        return thunkAPI.rejectWithValue("Invalid payload");
      }

      let id;
      let data;

      if (payload.hasOwnProperty("id") && payload.hasOwnProperty("data")) {
        id = payload.id;
        data = payload.data;
      } else if (payload.hasOwnProperty("id")) {
        id = payload.id;
        const { id: _id, ...rest } = payload;
        data = rest;
      } else {
        // fallback: if payload is an id number
        if (typeof payload === "number" || typeof payload === "string") {
          id = payload;
          data = {};
        } else {
          return thunkAPI.rejectWithValue("Invalid update payload");
        }
      }

      const res = await API.put(`/users/${id}`, data);
      return res?.data ?? null;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "manageUser/deleteUser",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// Slice
const manageUserSlice = createSlice({
  name: "manageUser",
  initialState: {
    users: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload ?? [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? "Failed to fetch users";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload) state.users.push(action.payload);
        state.successMessage = "User created successfully ✅";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? "Failed to create user";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = (state.users || []).map((u) =>
            u?.id === action.payload?.id ? action.payload : u
          );
        }
        state.successMessage = "User updated successfully ✅";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? "Failed to update user";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = (state.users || []).filter((u) => u?.id !== action.payload);
        state.successMessage = "User deleted successfully ❌";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? "Failed to delete user";
      });
  },
});

export const { clearMessages } = manageUserSlice.actions;

export default manageUserSlice.reducer;
