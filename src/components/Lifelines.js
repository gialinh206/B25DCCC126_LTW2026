import React from "react";

const Lifelines = ({
  usedLifelines,
  onFiftyFifty,
  onAudience,
  onQuit,
  disabled,
}) => (
  <div className="lifelines-container">
    <button
      type="button"
      className="lifeline-btn"
      onClick={onFiftyFifty}
      disabled={disabled || usedLifelines.fiftyFifty}
    >
      50-50
    </button>
    <button
      type="button"
      className="lifeline-btn"
      onClick={onAudience}
      disabled={disabled || usedLifelines.audience}
    >
      Khán giả
    </button>
    <button
      type="button"
      className="lifeline-btn"
      onClick={onQuit}
      disabled={disabled}
    >
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;
