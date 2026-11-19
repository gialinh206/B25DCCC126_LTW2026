import { createSlice } from "@reduxjs/toolkit";

const goalSlice = createSlice({
  name: "goal",
  initialState: {
    target: "3.2",
    remaining: "20",
  },
  reducers: {
    setTarget: (state, action) => {
      state.target = action.payload;
    },
    setRemaining: (state, action) => {
      state.remaining = action.payload;
    },
  },
});

export const { setTarget, setRemaining } = goalSlice.actions;
export const selectGoal = (state) => state.goal;
export default goalSlice.reducer;
