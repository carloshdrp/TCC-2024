import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizId: null,
  score: 0,
  currentStep: 1,
  quizQuestions: {},
};

const quizPracticeSlice = createSlice({
  name: "quizPractice",
  initialState,
  reducers: {
    setQuizId(state, action) {
      state.quizId = action.payload;
    },
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    setScore(state, action) {
      state.score = action.payload;
    },
    addOrUpdateQuizQuestion(state, action) {
      const { quizQuestionId, choice, text } = action.payload;
      state.quizQuestions[quizQuestionId] = { quizQuestionId, choice, text };
    },
    clearQuizPractice(state) {
      state.quizId = null;
      state.score = 0;
      state.currentStep = 1;
      state.quizQuestions = {};
    },
  },
});

export const {
  setQuizId,
  setScore,
  setCurrentStep,
  addOrUpdateQuizQuestion,
  clearQuizPractice,
} = quizPracticeSlice.actions;

export default quizPracticeSlice.reducer;

export const getQuizId = (state) => state.quizPractice.quizId;
export const getScore = (state) => state.quizPractice.score;
export const getCurrentStep = (state) => state.quizPractice.currentStep;
export const getQuizQuestions = (state) => state.quizPractice.quizQuestions;
