import React from "react";
import AnswerButton from "./AnswerButton";

const QuestionCard = ({
  question,
  currentIndex,
  selectedAnswer,
  status,
  hiddenOptions,
  onSelectAnswer,
}) => {
  return (
    <div className="question-panel">
      <div className="question-box">
        <span>{question.question}</span>
      </div>

      <div className="answers-grid">
        {question.options.map((option, idx) => (
          <AnswerButton
            key={idx}
            index={idx}
            optionText={option}
            correctIndex={question.answer}
            selectedIndex={selectedAnswer}
            status={status}
            isHidden={hiddenOptions.includes(idx)}
            onClick={() => onSelectAnswer(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
