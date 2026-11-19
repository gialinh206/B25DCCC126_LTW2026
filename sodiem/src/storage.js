const COURSES_STORAGE_KEY = "ltw_sodiem_courses";

export const loadSaved = () => {
  try {
    const raw = window.localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    window.localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // Bỏ qua lỗi lưu trữ
  }
};
