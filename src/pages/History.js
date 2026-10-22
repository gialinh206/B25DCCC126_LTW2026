import React from "react";
import { formatMoney } from "../data";

const History = ({ history, clearHistory }) => {
  if (history.length === 0) {
    return <h2>Chưa có lượt chơi nào.</h2>;
  }

  // Sắp xếp trên bản sao mảng theo tiền thưởng giảm dần[cite: 6, 8]
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  const totalGames = history.length;
  const maxPrize = Math.max(...history.map((h) => h.prize));
  const totalPrize = history.reduce((sum, h) => sum + h.prize, 0);

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      <div style={{ marginBottom: "15px" }}>
        <p>
          <strong>Số lượt chơi:</strong> {totalGames}
        </p>
        <p>
          <strong>Tiền thưởng cao nhất:</strong> {formatMoney(maxPrize)}
        </p>
        <p>
          <strong>Tổng tiền thưởng:</strong> {formatMoney(totalPrize)}
        </p>
        <button onClick={clearHistory}>Xóa lịch sử</button>
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Tiền thưởng</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.correctCount}</td>
              <td>{formatMoney(item.prize)}</td>
              <td>{item.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
