import React from "react";

const Timer = ({ timeLeft }) => {
  const safeTime = Number(timeLeft) || 0;

  return (
    <div
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: safeTime <= 10 ? "red" : "black",
      }}
    >
      Còn {safeTime} giây
    </div>
  );
};

export default Timer;
