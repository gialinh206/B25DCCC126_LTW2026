import React, { useRef } from "react";
import { formatPoint } from "../data";
import { getGrade } from "../utils";

const CourseRow = React.memo(({ course, onScore, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const gradeInfo = getGrade(course.score);
  const isFail = gradeInfo.letter === "F";

  const handleScoreChange = (e) => {
    const val = e.target.valueAsNumber;
    if (!Number.isNaN(val) && val >= 0 && val <= 10) {
      onScore(course.id, val);
    }
  };

  return (
    <tr className={isFail ? "row-fail" : ""}>
      <td>{course.code}</td>
      <td>{course.name}</td>
      <td>{course.credits}</td>
      <td>{course.semester}</td>
      <td>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          aria-label={`Điểm ${course.name}`}
          value={course.score}
          onChange={handleScoreChange}
          className="score-input"
        />
      </td>
      <td>{isFail ? "F – Học lại" : gradeInfo.letter}</td>
      <td>{formatPoint(gradeInfo.point)}</td>
      <td>{renderCount.current}</td>
      <td>
        <button
          type="button"
          className="btn-danger"
          onClick={() => onRemove(course.id, course.name)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
});

CourseRow.displayName = "CourseRow";

export default CourseRow;
