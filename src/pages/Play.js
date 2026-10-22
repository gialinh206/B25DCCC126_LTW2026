import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { TIME_PER_QUESTION } from "../data";
import { calcPrize, generateAudiencePoll } from "../utils";
import MoneyLadder from "../components/MoneyLadder";
import QuestionCard from "../components/QuestionCard";
import Lifelines from "../components/Lifelines";
import AudienceChart from "../components/AudienceChart";

const Play = ({ questions, playerName, addHistoryRecord }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState("answering");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
  });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [audiencePoll, setAudiencePoll] = useState(null);
  const currentQ = questions[currentIndex];

  const finishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);
      addHistoryRecord({
        id: Date.now(),
        name: playerName,
        prize,
        correctCount,
        playedAt: new Date().toLocaleString("vi-VN"),
      });
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
    [playerName, addHistoryRecord, navigate],
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
            setHiddenOptions([]);
            setAudiencePoll(null);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (status !== "answering") return;
      const keyMap = { A: 0, B: 1, C: 2, D: 3 };
      const answerIndex = keyMap[event.key.toUpperCase()];
      if (answerIndex !== undefined && !hiddenOptions.includes(answerIndex)) {
        setSelectedAnswer(answerIndex);
        setStatus("locked");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, hiddenOptions]);

  const handleUseFiftyFifty = () => {
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.answer);
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffled[0], shuffled[1]]);
    setUsedLifelines((prev) => ({ ...prev, fiftyFifty: true }));
  };

  const handleUseAudience = () => {
    setAudiencePoll(generateAudiencePoll(currentQ.answer, hiddenOptions));
    setUsedLifelines((prev) => ({ ...prev, audience: true }));
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
          <Lifelines
            usedLifelines={usedLifelines}
            onFiftyFifty={handleUseFiftyFifty}
            onAudience={handleUseAudience}
            onQuit={handleQuit}
            disabled={status !== "answering"}
          />
        </div>

        <div className="game-layout">
          <div className="play-main">
            {audiencePoll && <AudienceChart poll={audiencePoll} />}
            <QuestionCard
              question={currentQ}
              currentIndex={currentIndex}
              selectedAnswer={selectedAnswer}
              status={status}
              hiddenOptions={hiddenOptions}
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
