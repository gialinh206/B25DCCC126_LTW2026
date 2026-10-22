import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS } from "../data";

const QuestionBank = ({ questions, loading, error }) => {
  const [selectedLevel, setSelectedLevel] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <h2>Đang tải câu hỏi...</h2>;
  if (error) return <h2>Không tải được câu hỏi</h2>;

  const filteredQuestions = questions.filter((q) => {
    const matchLevel =
      selectedLevel === "0" || q.level === Number(selectedLevel);
    const matchSearch = q.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div style={{ marginBottom: "15px" }}>
        <label>Mức độ: </label>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="0">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm nội dung..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      <p>Có {filteredQuestions.length} câu hỏi.</p>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
