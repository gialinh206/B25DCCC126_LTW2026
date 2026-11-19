import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { GRADES, SEMESTERS } from "./data";
import { useFetch } from "./hooks/useFetch";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDebounce } from "./hooks/useDebounce";
import { useTheme } from "./context/ThemeContext";
import { useNotice } from "./context/NoticeContext";
import {
  removeCourse,
  selectCourses,
  setCourses,
  setScore,
} from "./features/coursesSlice";
import { hasSaved } from "./store";
import { calcStats, getGrade } from "./utils";
import CourseRow from "./components/CourseRow";
import AddCourseForm from "./components/AddCourseForm";
import GoalPlanner from "./components/GoalPlanner";

const BUILD_TAG = "gp-4073";

const App = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const { data, loading, error } = useFetch("/data/courses.json");
  const [selectedSemester, setSelectedSemester] = useLocalStorage(
    "ltw_sodiem_semester",
    "all",
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!hasSaved && Array.isArray(data)) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  const semesterCourses = useMemo(() => {
    if (selectedSemester === "all") {
      return courses;
    }
    return courses.filter((item) => item.semester === selectedSemester);
  }, [courses, selectedSemester]);

  const visibleCourses = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) {
      return semesterCourses;
    }
    return semesterCourses.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword),
    );
  }, [semesterCourses, debouncedSearch]);

  const filteredStats = useMemo(
    () => calcStats(semesterCourses),
    [semesterCourses],
  );

  const overallStats = useMemo(() => calcStats(courses), [courses]);

  const gradeDistribution = useMemo(() => {
    const countsMap = semesterCourses.reduce((acc, item) => {
      const letter = getGrade(item.score).letter;
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    return GRADES.map((gradeItem) => ({
      letter: gradeItem.letter,
      count: countsMap[gradeItem.letter] || 0,
    }));
  }, [semesterCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${overallStats.gpa} – Sổ điểm`;
    } else {
      document.title = "Sổ điểm";
    }
  }, [courses.length, overallStats.gpa]);

  const handleCourseShift = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement
        ? document.activeElement.tagName
        : "";
      const isFormField =
        activeTag === "INPUT" ||
        activeTag === "TEXTAREA" ||
        activeTag === "SELECT";

      if (e.key === "/" && !isFormField) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (
        e.key === "Escape" &&
        document.activeElement === searchInputRef.current
      ) {
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleScoreChange = useCallback(
    (id, newScore) => {
      dispatch(setScore({ id, score: newScore }));
    },
    [dispatch],
  );

  const handleRemoveCourse = useCallback(
    (id, courseName) => {
      dispatch(removeCourse(id));
      showNotice(`Đã xóa môn ${courseName}`);
    },
    [dispatch, showNotice],
  );

  const handleResetSampleData = useCallback(() => {
    if (Array.isArray(data)) {
      dispatch(setCourses(data));
      showNotice("Đã đặt lại dữ liệu mẫu");
    }
  }, [data, dispatch, showNotice]);

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <div className="container">
        <header className="top-header">
          <div>
            <h1 className="brand-title">Sổ điểm sinh viên</h1>
            <button
              type="button"
              className="btn btn-secondary theme-toggle-icon"
              onClick={toggleTheme}
              aria-label={
                theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"
              }
              title={
                theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"
              }
            >
              {theme === "light" ? (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {!hasSaved && loading && <p>Đang tải bảng điểm...</p>}
        {!hasSaved && !loading && error && (
          <p role="alert">Không tải được bảng điểm</p>
        )}

        <div className="grid-two">
          <section className="panel" aria-label="Thống kê">
            <h2>Thống kê</h2>
            <ul className="stats-list">
              <li>Số môn: {filteredStats.count}</li>
              <li>Tổng tín chỉ: {filteredStats.credits}</li>
              <li>GPA (hệ 4): {filteredStats.gpa}</li>
              <li>Xếp loại: {filteredStats.rank}</li>
              <li>GPA tích lũy: {overallStats.gpa}</li>
            </ul>

            <h3>Phân bố điểm chữ</h3>
            <ul className="distribution-list">
              {gradeDistribution.map((entry) => (
                <li key={entry.letter} className="distribution-item">
                  <span>
                    {entry.letter}: {entry.count}
                  </span>
                  <span
                    className="distribution-bar"
                    style={{ width: `${entry.count * 24}px` }}
                  />
                </li>
              ))}
            </ul>
          </section>

          <GoalPlanner />
        </div>

        <section className="panel" aria-label="Bảng điểm">
          <h2>Bảng điểm</h2>

          <div className="toolbar">
            <div className="field">
              <label htmlFor="semester-filter">Xem học kỳ</label>
              <select
                id="semester-filter"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="course-search">Tìm môn học</label>
              <input
                id="course-search"
                ref={searchInputRef}
                type="text"
                placeholder="Nhập mã hoặc tên môn..."
                value={search}
                onChange={handleCourseShift}
              />
            </div>
          </div>

          <p>Tìm thấy {visibleCourses.length} môn</p>

          {visibleCourses.length === 0 ? (
            <p>Chưa có môn học nào</p>
          ) : (
            <div className="table-wrap">
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    <th>Tín chỉ</th>
                    <th>Học kỳ</th>
                    <th>Điểm (hệ 10)</th>
                    <th>Điểm chữ</th>
                    <th>Điểm (hệ 4)</th>
                    <th>Số lần render</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCourses.map((course) => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      onScore={handleScoreChange}
                      onRemove={handleRemoveCourse}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="table-footer-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetSampleData}
            >
              Đặt lại dữ liệu mẫu
            </button>
          </div>
        </section>

        <AddCourseForm />
      </div>
    </div>
  );
};

export default App;
