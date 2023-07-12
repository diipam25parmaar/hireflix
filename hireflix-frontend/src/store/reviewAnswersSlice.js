import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

// Fetch submissions for a given interview
export const fetchSubmissions = createAsyncThunk(
  "reviewAnswers/fetchSubmissions",
  async (interviewId, thunkAPI) => {
    try {
      const res = await API.get(`/interviews/${interviewId}/submissions`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch submissions"
      );
    }
  }
);

// Submit a review for a specific answer
export const submitReview = createAsyncThunk(
  "reviewAnswers/submitReview",
  async ({ answerId, score, comment }, thunkAPI) => {
    try {
      await API.post(`/answers/${answerId}/review`, { score, comment });
      return { answerId, score, comment };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

// Delete an interview
export const deleteInterview = createAsyncThunk(
  "reviewAnswers/deleteInterview",
  async (interviewId, thunkAPI) => {
    try {
      await API.delete(`/interviews/${interviewId}`);
      return interviewId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete interview"
      );
    }
  }
);

const reviewAnswersSlice = createSlice({
  name: "reviewAnswers",
  initialState: {
    submissions: [],
    reviewData: {},
    loading: false,
    submittingReview: false,
    deleting: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setReviewData: (state, action) => {
      state.reviewData = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSubmissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;

        // Initialize reviewData
        const initialReviewData = {};
        action.payload.forEach(sub =>
          sub.answers.forEach(ans => {
            initialReviewData[ans.id] = {
              score: ans.score ?? "",
              comment: ans.review_comment ?? "",
            };
          })
        );
        state.reviewData = initialReviewData;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // submitReview
      .addCase(submitReview.pending, (state) => {
        state.submittingReview = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submittingReview = false;
        const { answerId, score, comment } = action.payload;

        // Update reviewData
        state.reviewData[answerId] = { score, comment };

        // Update submissions array
        state.submissions = state.submissions.map(sub => ({
          ...sub,
          answers: sub.answers.map(ans =>
            ans.id === answerId
              ? { ...ans, score, review_comment: comment }
              : ans
          )
        }));

        state.successMessage = "Review submitted successfully!";
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submittingReview = false;
        state.error = action.payload;
      })

      // deleteInterview
      .addCase(deleteInterview.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = "Interview deleted successfully!";
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { setReviewData, clearMessages } = reviewAnswersSlice.actions;
export default reviewAnswersSlice.reducer;
