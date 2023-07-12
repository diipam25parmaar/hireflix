import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/axios';

export const fetchSubmissions = createAsyncThunk('review/fetchSubmissions', async (interviewId) => {
  const res = await API.get(`/interviews/${interviewId}/submissions`);
  return res.data;
});

export const submitReview = createAsyncThunk('review/submit', async ({ answerId, score, comment }) => {
  const res = await API.post(`/answers/${answerId}/review`, { score, comment });
  return res.data;
});

const reviewSlice = createSlice({
  name: 'review',
  initialState: { submissions:[], loading:false, error:null},
  reducers:{},
  extraReducers: builder => {
    builder
      .addCase(fetchSubmissions.fulfilled, (s,a) => { s.submissions = a.payload; })
      .addCase(submitReview.fulfilled, (s,a) => {
         // update answer in local state; backend returns answer
         const answer = a.payload.answer ?? a.payload;
         s.submissions = s.submissions.map(sub => {
           return {
             ...sub,
             answers: sub.answers.map(ans => ans.id === answer.id ? answer : ans)
           };
         });
      })
      .addMatcher(action => action.type.endsWith('/pending'), (s)=>{ s.loading=true; })
      .addMatcher(action => action.type.endsWith('/fulfilled'), (s)=>{ s.loading=false; })
      .addMatcher(action => action.type.endsWith('/rejected'), (s,a)=>{ s.loading=false; s.error=a.error.message; });
  }
});

export default reviewSlice.reducer;
