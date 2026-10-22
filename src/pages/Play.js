import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";
import MoneyLadder from "../components/MoneyLadder";
import QuestionCard from "../components/QuestionCard";

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState("answering");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const currentQ = questions[currentIndex];

  const finishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);
      let message = "Chúc mừng! Bạn đã trở thành triệu phú";
      if (reason === "wrong") message = "Rất tiếc, bạn đã trả lời sai!";
      if (reason === "timeout") message = "Hết giờ!";
      if (reason === "quit") message = "Bạn đã dừng cuộc chơi";

      navigate("/result", {
        replace: true,
        state: {
          name: playerName,
          prize,
          correctCount,
          reasonMessage: message,
        },
      });
    },
    [playerName, navigate],
  );

  useEffect(() => {
    document.title = playerName
      ? `Câu ${currentIndex + 1}/15 – ${playerName}`
      : "Ai là triệu phú";
    return () => {
      document.title = "Ai là triệu phú";
    };
  }, [currentIndex, playerName]);

  useEffect(() => {
    if (status !== "answering") return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(currentIndex, "timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, currentIndex, finishGame]);

  useEffect(() => {
    let timeoutId;
    if (status === "locked") {
      timeoutId = setTimeout(() => setStatus("revealed"), 1000);
    } else if (status === "revealed") {
      timeoutId = setTimeout(() => {
        if (selectedAnswer === currentQ.answer) {
          if (currentIndex === 14) {
            finishGame(15, "win");
          } else {
            setCurrentIndex((prev) => prev + 1);
            setStatus("answering");
            setSelectedAnswer(null);
            setTimeLeft(TIME_PER_QUESTION);
          }
        } else {
          finishGame(currentIndex, "wrong");
        }
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [status, selectedAnswer, currentQ, currentIndex, finishGame]);

  const handleSelectAnswer = (index) => {
    if (status !== "answering") return;
    setSelectedAnswer(index);
    setStatus("locked");
  };

  const handleQuit = () => finishGame(currentIndex, "quit");

  if (!playerName) return <Navigate to="/" replace />;
  if (!currentQ) return null;

  return (
    <div className="app-container">
      <div className="game-screen">
        <div className="game-header">
          <div className="header-group">
            <div className="header-badge primary">CÂU {currentIndex + 1}/15</div>
            <div className="header-badge">{timeLeft}s</div>
          </div>
          <button
            className="lifeline-btn"
            onClick={handleQuit}
            disabled={status !== "answering"}
          >
            Dừng cuộc chơi
          </button>
        </div>

        <div className="game-layout">
          <div className="play-main">
            <QuestionCard
              question={currentQ}
              currentIndex={currentIndex}
              selectedAnswer={selectedAnswer}
              status={status}
              hiddenOptions={[]}
              onSelectAnswer={handleSelectAnswer}
            />
          </div>
          <MoneyLadder currentIndex={currentIndex} />
        </div>
      </div>
    </div>
  );
};

export default Play;
