import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../data";

const Home = ({ playerName, setPlayerName, history = [] }) => {
  const [nameInput, setNameInput] = useState(playerName || "");
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setPlayerName(nameInput.trim());
    navigate("/play");
  };
  const record = history.reduce(
    (best, item) => (item.prize > (best?.prize ?? -1) ? item : best),
    null,
  );

  return (
    <div className="app-container">
      <div className="home-screen">
        <div className="logo-container">
          <div className="logo-ring">
            <div className="logo-inner">?</div>
          </div>
        </div>

        <div className="title-card">
          <h1>AI LÀ TRIỆU PHÚ</h1>
          <p>Millionaire Quiz (H5)</p>
        </div>
        {record && (
          <p className="home-record">
            Kỷ lục: {formatMoney(record.prize)} – {record.name}
          </p>
        )}

        <form className="home-form" onSubmit={handleStart}>
          <input
            type="text"
            className="name-input"
            placeholder="Nhập tên người chơi..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button
            type="submit"
            className="menu-button"
            disabled={!nameInput.trim()}
          >
            Bắt đầu
          </button>
          <button
            type="button"
            className="menu-button secondary"
            onClick={() => navigate("/questions")}
          >
            Giới thiệu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
