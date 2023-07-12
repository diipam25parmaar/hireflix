import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

export const fetchCandidateInterviews = createAsyncThunk(
  "candidate/fetchInterviews",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/candidate/interviews");
      return res?.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch candidate interviews"
      );
    }
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    interviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload || [];
      })
      .addCase(fetchCandidateInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default candidateSlice.reducer;
