import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0,
};

const exerciseCreateSlice = createSlice({
  name: "exerciseCreate",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
  },
});

export const { setStep } = exerciseCreateSlice.actions;

export default exerciseCreateSlice.reducer;

export const getStep = (state) => state.exerciseCreate.step;
