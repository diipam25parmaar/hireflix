import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

// Fetch all interviews for reviewers
export const fetchInterviews = createAsyncThunk(
  "reviewer/fetchInterviews",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/interviews");
      return res?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch interviews"
      );
    }
  }
);

const reviewerSlice = createSlice({
  name: "reviewer",
  initialState: {
    interviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action?.payload || [];
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload || "Failed to fetch interviews";
      });
  },
});

export default reviewerSlice.reducer;
