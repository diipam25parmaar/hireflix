import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import interviewsReducer from './interviewsSlice';
import reviewReducer from './reviewSlice';
import adminReducer from './adminSlice';
import CandidateReducer from './candidateSlice';
import ManageUserReducer from './manageUserSlice';
import recordAnswerReducer from './recordAnswersSlice';
import reviewAnswerReducer from './reviewAnswersSlice';
import reviewerReducer from './reviewerSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    interviews: interviewsReducer,
    review: reviewReducer,
    admin: adminReducer,
    candidate: CandidateReducer,
    manageUser: ManageUserReducer,  
    recordAnswers: recordAnswerReducer,
    reviewAnswers: reviewAnswerReducer,       
    reviewer: reviewerReducer,   
  },
});
