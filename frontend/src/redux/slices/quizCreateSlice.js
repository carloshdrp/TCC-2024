import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0,
  quiz: {},
  question: [],
  editing: false,
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
    setEditing(state, action) {
      state.editing = action.payload;
    },
    clearQuiz(state) {
      state.quiz = {};
    },
    addQuestion(state, action) {
      state.question.push(action.payload);
    },
    updateQuestion(state, action) {
      const { index, question } = action.payload;
      if (index >= 0 && index < state.question.length) {
        state.question[index] = {
          ...state.question[index],
          ...question,
        };
      }
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
  setEditing,
  clearQuiz,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearQuestion,
} = quizCreateSlice.actions;

export default quizCreateSlice.reducer;

export const getStep = (state) => state.quizCreate.step;
export const getQuiz = (state) => state.quizCreate.quiz;
export const getEditing = (state) => state.quizCreate.editing;
export const getQuestion = (state) => state.quizCreate.question;
