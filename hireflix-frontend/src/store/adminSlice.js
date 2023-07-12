import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/axios';

// Fetch candidates
export const fetchCandidates = createAsyncThunk(
  'admin/fetchCandidates',
  async () => {
    const res = await API.get('/candidates');
    return res?.data || [];
  }
);

// Create interview
export const createInterview = createAsyncThunk(
  'admin/createInterview',
  async ({ title, description, questions }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      questions.forEach((q, i) => {
        formData.append(`questions[${i}][text]`, q.text);
        formData.append(`questions[${i}][position]`, q.position);
        if (q.max_seconds) {
          formData.append(`questions[${i}][max_seconds]`, q.max_seconds);
        }
      });

      const res = await API.post('/interviews', formData);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Error creating interview');
    }
  }
);

// Update interview
export const updateInterview = createAsyncThunk(
  'admin/updateInterview',
  async ({ id, title, description, questions }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      questions.forEach((q, i) => {
        formData.append(`questions[${i}][text]`, q.text);
        formData.append(`questions[${i}][position]`, q.position);
        if (q.max_seconds) {
          formData.append(`questions[${i}][max_seconds]`, q.max_seconds);
        }
      });

      const res = await API.post(`/interviews/${id}/update?_method=PUT`, formData);
      return res?.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Error updating interview');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    candidates: [],
    loading: false,
    error: null,
    createInterviewLoading: false,
    createInterviewError: null,
    createInterviewSuccess: false,
    updateInterviewLoading: false,
    updateInterviewError: null,
    updateInterviewSuccess: false,
  },
  reducers: {
    resetCreateInterviewState: (state) => {
      state.createInterviewLoading = false;
      state.createInterviewError = null;
      state.createInterviewSuccess = false;
    },
    resetUpdateInterviewState: (state) => {
      state.updateInterviewLoading = false;
      state.updateInterviewError = null;
      state.updateInterviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCandidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload || [];
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Error';
      })
      // createInterview
      .addCase(createInterview.pending, (state) => {
        state.createInterviewLoading = true;
        state.createInterviewError = null;
        state.createInterviewSuccess = false;
      })
      .addCase(createInterview.fulfilled, (state) => {
        state.createInterviewLoading = false;
        state.createInterviewSuccess = true;
      })
      .addCase(createInterview.rejected, (state, action) => {
        state.createInterviewLoading = false;
        state.createInterviewError = action.payload || 'Error creating interview';
      })
      // updateInterview
      .addCase(updateInterview.pending, (state) => {
        state.updateInterviewLoading = true;
        state.updateInterviewError = null;
        state.updateInterviewSuccess = false;
      })
      .addCase(updateInterview.fulfilled, (state) => {
        state.updateInterviewLoading = false;
        state.updateInterviewSuccess = true;
      })
      .addCase(updateInterview.rejected, (state, action) => {
        state.updateInterviewLoading = false;
        state.updateInterviewError = action.payload || 'Error updating interview';
      });
  },
});

export const { resetCreateInterviewState, resetUpdateInterviewState } = adminSlice.actions;
export default adminSlice.reducer;
