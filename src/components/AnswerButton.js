import React from "react";
import { LETTERS } from "../data";

const AnswerButton = ({
  index,
  optionText,
  correctIndex,
  selectedIndex,
  status,
  isHidden,
  onClick,
}) => {
  const letter = LETTERS[index];
  const isSelected = selectedIndex === index;
  const isCorrect = index === correctIndex;

  let className = "answer-btn";
  if (status === "locked" && isSelected) className += " locked";
  if (status === "revealed" && isCorrect) className += " correct";
  if (status === "revealed" && isSelected && !isCorrect) className += " wrong";
  if (isHidden) className += " hidden";

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={status !== "answering" || isHidden}
      aria-label={`Đáp án ${letter}`}
    >
      <span className="answer-letter">{letter}</span>
      <span>{isHidden ? "" : optionText}</span>
    </button>
  );
};

export default AnswerButton;
