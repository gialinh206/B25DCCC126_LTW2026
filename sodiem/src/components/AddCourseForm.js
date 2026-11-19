import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREDIT_OPTIONS, SEMESTERS } from "../data";
import { addCourse, selectCourses } from "../features/coursesSlice";
import { useNotice } from "../context/NoticeContext";

const AddCourseForm = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const showNotice = useNotice();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState("");

  const [errors, setErrors] = useState({
    code: "",
    name: "",
    score: "",
  });

  const codeInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const trimmedScore = String(score).trim();
    const numericScore = Number(trimmedScore);

    let codeError = "";
    if (!trimmedCode) {
      codeError = "Hãy nhập mã môn";
    } else {
      const isDuplicate = courses.some(
        (item) => item.code.trim().toLowerCase() === trimmedCode.toLowerCase(),
      );
      if (isDuplicate) {
        codeError = "Mã môn đã tồn tại";
      }
    }

    const nameError = !trimmedName ? "Hãy nhập tên môn" : "";

    const isScoreInvalid =
      trimmedScore === "" ||
      Number.isNaN(numericScore) ||
      numericScore < 0 ||
      numericScore > 10;
    const scoreError = isScoreInvalid ? "Điểm phải từ 0 đến 10" : "";

    if (codeError || nameError || scoreError) {
      setErrors({
        code: codeError,
        name: nameError,
        score: scoreError,
      });
      return;
    }

    const normalizedCode = trimmedCode.toUpperCase();
    const numericCredits = Number(credits);

    dispatch(
      addCourse({
        code: normalizedCode,
        name: trimmedName,
        credits: numericCredits,
        semester,
        score: numericScore,
      }),
    );

    showNotice(`Đã thêm môn ${trimmedName}`);

    setCode("");
    setName("");
    setCredits(3);
    setSemester(SEMESTERS[0]);
    setScore("");
    setErrors({ code: "", name: "", score: "" });

    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  return (
    <section className="panel" aria-label="Thêm môn học">
      <h2>Thêm môn học</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="course-code">Mã môn</label>
            <input
              id="course-code"
              ref={codeInputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {errors.code && (
              <div role="alert" className="error-text">
                {errors.code}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="course-name">Tên môn</label>
            <input
              id="course-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div role="alert" className="error-text">
                {errors.name}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="course-credits">Số tín chỉ</label>
            <select
              id="course-credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            >
              {CREDIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="course-semester">Học kỳ</label>
            <select
              id="course-semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="course-score">Điểm hệ 10</label>
            <input
              id="course-score"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
            {errors.score && (
              <div role="alert" className="error-text">
                {errors.score}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn">
          Thêm môn
        </button>
      </form>
    </section>
  );
};

export default AddCourseForm;
