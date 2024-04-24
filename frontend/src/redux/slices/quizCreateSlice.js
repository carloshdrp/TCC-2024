import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0,
  quiz: {},
  question: [],
};

const quizCreateSlice = createSlice({
  name: "quizCreate",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setQuiz(state, action) {
      state.quiz = action.payload;
    },
    clearQuiz(state) {
      state.quiz = {};
    },
    addQuestion(state, action) {
      state.question.push(action.payload);
    },
    removeQuestion(state, action) {
      state.question.splice(action.payload, 1);
    },
    clearQuestion(state) {
      state.question = [];
    },
  },
});

export const {
  setStep,
  setQuiz,
  clearQuiz,
  addQuestion,
  removeQuestion,
  clearQuestion,
} = quizCreateSlice.actions;

export default quizCreateSlice.reducer;

export const getStep = (state) => state.quizCreate.step;
export const getQuiz = (state) => state.quizCreate.quiz;
export const getQuestion = (state) => state.quizCreate.question;
