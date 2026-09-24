import React, { useState } from "react";
import "./QuanLy.css";

const initialStudents = [
  { id: 1, name: "Nguyễn Thị A", score: 3, class: "D25CQCC05" },
  { id: 2, name: "Ngô Gia Linh", score: 9.5, class: "D25CQCC06" },
  { id: 3, name: "Phạm Quỳnh Anh", score: 7, class: "D25CQCC01" },
];

const getStudentRank = (score) => {
  if (score >= 8) return "GIOI";
  if (score >= 6.5 && score < 8) return "KHA";
  if (score >= 4 && score < 6.5) return "TRUNGBINH";
  return "TRUOT";
};

const useStudentManager = () => {
  const [list, setList] = useState(initialStudents);
  const [filterMode, setFilterMode] = useState("ALL");

  const filteredList = list.filter(({ score }) => {
    if (filterMode === "ALL") return true;
    return getStudentRank(score) === filterMode;
  });

  const totalCount = list.length;
  const avgScore = totalCount
    ? (list.reduce((acc, { score }) => acc + score, 0) / totalCount).toFixed(2)
    : 0;

  const addStudent = ({ name, score, className }) => {
    if (!name.trim() || !score.toString().trim() || !className.trim()) {
      return { ok: false, msg: "Điền đầy đủ thông tin!!!" };
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      return { ok: false, msg: "Điểm số phải nằm trong khoảng từ 0 đến 10!" };
    }

    const newItem = {
      id: `SV${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      score: numericScore,
      class: className.trim(),
    };

    setList((prev) => [newItem, ...prev]);
    return { ok: true };
  };

  const removeStudent = (targetId) => {
    setList((prev) => prev.filter(({ id }) => id !== targetId));
  };

  return {
    students: filteredList,
    stats: { totalCount, avgScore },
    filterMode,
    setFilterMode,
    addStudent,
    removeStudent,
  };
};

const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;

  const getTagClass = (val) => {
    if (val >= 8) return { text: "Giỏi", className: "tag-gioi" };
    if (val >= 6.5 && val < 8) return { text: "Khá", className: "tag-kha" };
    if (val >= 4 && val < 6.5)
      return { text: "Trung Bình", className: "tag-trungbinh" };
    if (val < 4) return { text: "Trượt", className: "tag-truot" };
  };

  const tag = getTagClass(score);

  return (
    <tr className="table-body-row">
      <td className="td-cell">{id}</td>
      <td className="td-cell">{name}</td>
      <td className="td-cell">{className}</td>
      <td className="td-cell td-score">{score}</td>
      <td className="td-cell">
        <span className={`tag-badge ${tag.className}`}>{tag.text}</span>
      </td>
      <td className="td-cell">
        <button onClick={() => onDelete(id)} className="btn-delete">
          Xóa
        </button>
      </td>
    </tr>
  );
};

const StudentTable = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <div className="empty-message">Danh sách trống!</div>;
  }

  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr className="table-header-row">
            <th className="th-cell">Mã SV</th>
            <th className="th-cell">Họ tên</th>
            <th className="th-cell">Lớp</th>
            <th className="th-cell">Điểm</th>
            <th className="th-cell">Xếp loại</th>
            <th className="th-cell">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const {
    students,
    stats,
    filterMode,
    setFilterMode,
    addStudent,
    removeStudent,
  } = useStudentManager();

  const [formData, setFormData] = useState({
    name: "",
    score: "",
    className: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addStudent(formData);

    if (!result.ok) {
      setErrorMsg(result.msg);
    } else {
      setFormData({ name: "", score: "", className: "" });
      setErrorMsg("");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">QUẢN LÝ ĐIỂM SINH VIÊN </h1>
      </header>

      <section className="form-card">
        <h3 className="form-title">Thêm sinh viên mới</h3>
        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="className"
            placeholder="Mã lớp"
            value={formData.className}
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="number"
            step="0.1"
            name="score"
            placeholder="Điểm (0-10)"
            value={formData.score}
            onChange={handleChange}
            className="form-input"
          />
          <button type="submit" className="btn-submit">
            + Thêm Mới
          </button>
        </form>
      </section>

      <section className="filter-section">
        <div>
          <span className="filter-label">Bộ lọc:</span>
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "KHA", label: "Khá (6.5 - 8.0)" },
            { key: "GIOI", label: "Giỏi (≥ 8.0)" },
            { key: "TRUNGBINH", label: "Trung Bình (4.0 - 6.5)" },
            { key: "TRUOT", label: "Trượt (< 4.0)" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterMode(key)}
              className={`btn-filter ${filterMode === key ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="stats-badge">
          Tổng SV: <strong>{stats.totalCount}</strong> | Điểm TB:{" "}
          <strong>{stats.avgScore}</strong>
        </div>
      </section>
      <StudentTable students={students} onDelete={removeStudent} />
    </div>
  );
};

export default App;
