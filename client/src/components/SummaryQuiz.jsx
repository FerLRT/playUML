import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";

import { LevelIndicator } from "./LevelIndicator";
import { ScoreDistributionChart } from "./ScoreDistributionChart";

import "../styles/summaryQuiz.css";

export function SummaryView({ quizScore, startTime, endTime }) {
  const navigate = useNavigate();
  const [numberOfPieces, setNumberOfPieces] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("0 minutos y 0 segundos");

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!quizScore || quizScore < 5) {
      return;
    }

    setNumberOfPieces(200);
    // Luego de 3 segundos, el confeti se detendrá
    setTimeout(() => {
      setNumberOfPieces(0);
    }, 3000);
  }, [quizScore]);

  useEffect(() => {
    if (startTime && endTime) {
      const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
      const minutes = Math.floor(elapsedTimeInSeconds / 60);
      const seconds = elapsedTimeInSeconds % 60;
      setElapsedTime(
        `${
          minutes === 0 ? "" : `${minutes} minutos ${seconds === 0 ? "" : "y "}`
        }${seconds} segundos`
      );
    }
  }, [startTime, endTime]);

  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="summary-view-container">
      <h1>Resumen del test</h1>
      <LevelIndicator />
      <h2>Nota: {quizScore}/10</h2>
      <h2>Has completado el test en {elapsedTime}</h2>

      <ScoreDistributionChart userScore={quizScore} />

      <button onClick={handleButtonClick}>Volver al inicio</button>

      <Confetti width={width} height={height} numberOfPieces={numberOfPieces} />
    </div>
  );
}
