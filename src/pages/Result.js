import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatMoney } from "../data";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    navigate("/", { replace: true });
    return null;
  }

  const { name, prize, correctCount, reasonMessage } = state;

  return (
    <div>
      <h2>{reasonMessage}</h2>
      <p>
        <strong>Người chơi:</strong> {name}
      </p>
      <p>
        <strong>Số câu trả lời đúng:</strong> {correctCount}
      </p>
      <p>
        <strong>Tiền thưởng:</strong> {formatMoney(prize)}
      </p>

      <button onClick={() => navigate("/play")}>Chơi lại</button>
      <button onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>
        Về trang chủ
      </button>
    </div>
  );
};

export default Result;
