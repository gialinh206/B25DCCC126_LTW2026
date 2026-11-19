import { createSlice } from "@reduxjs/toolkit";

const coursesSlice = createSlice({
  name: "courses",
  initialState: [],
  reducers: {
    setCourses: (_state, action) => [...action.payload],
    addCourse: (state, action) => {
      const maxId = state.reduce(
        (max, item) => (item.id > max ? item.id : max),
        0,
      );
      state.push({
        ...action.payload,
        id: maxId + 1,
      });
    },
    removeCourse: (state, action) =>
      state.filter((item) => item.id !== action.payload),
    setScore: (state, action) =>
      state.map((item) =>
        item.id === action.payload.id
          ? { ...item, score: action.payload.score }
          : item,
      ),
  },
});

export const { setCourses, addCourse, removeCourse, setScore } =
  coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;
