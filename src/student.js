import React, { useState } from "react";

const StudentItem = ({ name, score }) => (
  <li>{`Tên: ${name} - Điểm: ${score}`}</li>
);

// 2. Component con: Dùng .map() render danh sách
const StudentList = ({ students }) => (
  <ul>
    {students.map((item) => (
      <StudentItem key={item.id} name={item.name} score={item.score} />
    ))}
  </ul>
);

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn A", score: 8.5 },
    { id: 2, name: "Ngô Gia Linh", score: 9.0 },
  ]);
  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName || !newScore) return;

    setStudents([
      ...students,
      { id: Date.now(), name: newName, score: newScore },
    ]);
    setNewName("");
    setNewScore("");
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Tên"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="Điểm"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
        />
        <button type="submit">Thêm sinh viên</button>
      </form>

      <StudentList students={students} />
    </div>
  );
};

export default App;
