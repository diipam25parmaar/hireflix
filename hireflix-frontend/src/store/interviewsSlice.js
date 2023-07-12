import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/axios';

export const fetchInterviews = createAsyncThunk('interviews/fetch', async () => {
  const res = await API.get('/interviews');
  return res?.data || [];
});

export const createInterview = createAsyncThunk('interviews/create', async (payload, thunkAPI) => {
  if (!payload || !payload.title || !Array.isArray(payload.questions)) return {};
  const form = new FormData();
  form.append('title', payload.title);
  form.append('description', payload.description || '');
  payload.questions.forEach((q, i) => {
    if (q?.text) {
      form.append(`questions[${i}][text]`, q.text);
      form.append(`questions[${i}][position]`, q.position || i + 1);
    }
  });
  const res = await API.post('/interviews', form);
  if (payload.user_ids?.length) {
    await API.post(`/interviews/${res?.data?.id}/assign`, { user_ids: payload.user_ids });
  }
  return res?.data || {};
});

export const assignInterview = createAsyncThunk('interviews/assign', async ({ interviewId, userIds }) => {
  if (!interviewId || !Array.isArray(userIds)) return {};
  const res = await API.post(`/interviews/${interviewId}/assign`, { user_ids: userIds });
  return res?.data || {};
});

export const fetchAssignedInterviews = createAsyncThunk('interviews/fetchAssigned', async () => {
  const res = await API.get('/admin/assigned-interviews');
  return res?.data || [];
});

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState: { list: [], assigned: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.fulfilled, (s, a) => { s.list = a.payload || []; })
      .addCase(fetchAssignedInterviews.fulfilled, (s, a) => { s.assigned = a.payload || []; })
      .addCase(createInterview.fulfilled, (s, a) => { if (a.payload) s.list.unshift(a.payload); })
      .addCase(assignInterview.fulfilled, (s, a) => { })
      .addMatcher((action) => action.type.endsWith('/pending'), (s) => { s.loading = true; s.error = null; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (s) => { s.loading = false; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (s, a) => { s.loading = false; s.error = a.error?.message || 'Error'; });
  }
});

export default interviewsSlice.reducer;
