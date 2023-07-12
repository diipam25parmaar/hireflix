import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/axios";

// Fetch interview questions by interviewId
export const fetchInterviewQuestions = createAsyncThunk(
  "recordAnswers/fetchInterview",
  async (interviewId, thunkAPI) => {
    try {
      const res = await API.get(`/interviews/${interviewId}`);
      return res?.data?.questions || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load interview"
      );
    }
  }
);

// Submit answers for a given interview
export const submitAnswers = createAsyncThunk(
  "recordAnswers/submitAnswers",
  async ({ interviewId, answers }, thunkAPI) => {
    try {
      const formData = new FormData();
      if (answers && typeof answers === "object") {
        Object.entries(answers).forEach(([question_id, data]) => {
          if (data?.file) {
            formData.append(`answers[${question_id}][file]`, data.file);
          }
          if (data?.duration) {
            formData.append(
              `answers[${question_id}][duration_seconds]`,
              data.duration
            );
          }
        });
      }

      await API.post(`/candidate/submit/${interviewId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return "Answers submitted successfully!";
    } catch (err) {
      if (err?.response?.status === 409) {
        return thunkAPI.rejectWithValue(
          "You have already submitted this interview."
        );
      }
      return thunkAPI.rejectWithValue("Failed to submit answers.");
    }
  }
);

const recordAnswersSlice = createSlice({
  name: "recordAnswers",
  initialState: {
    questions: [],
    answers: {},
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, data } = action.payload || {};
      if (questionId) {
        state.answers[questionId] = data;
      }
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload || [];
      })
      .addCase(fetchInterviewQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitAnswers.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.submitting = false;
        state.successMessage = action.payload;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { setAnswer, clearMessages } = recordAnswersSlice.actions;
export default recordAnswersSlice.reducer;
