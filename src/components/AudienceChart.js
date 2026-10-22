import React from "react";
import { LETTERS } from "../data";

const AudienceChart = ({ poll }) => (
  <div style={{ border: "1px dashed #666", padding: "10px", margin: "10px 0" }}>
    <h4>Kết quả bình chọn khán giả:</h4>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: "120px",
        gap: "15px",
      }}
    >
      {poll.map((pct, idx) => (
        <div key={idx} style={{ textAlign: "center", width: "40px" }}>
          <div>{pct}%</div>
          <div
            style={{
              height: `${pct}px`,
              backgroundColor: "dodgerblue",
              margin: "5px auto",
            }}
          />
          <div>{LETTERS[idx]}</div>
        </div>
      ))}
    </div>
  </div>
);

export default AudienceChart;
