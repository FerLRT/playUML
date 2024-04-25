import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserAchievements } from "../hooks/useAchievement";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import "../styles/achievement.css";

export function AchievementPage() {
  const { uid, token } = useAuth();
  const [achievements, setAchievements] = useState([]);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchData = () => {
      getUserAchievements(uid, token)
        .then((response) => {
          setAchievements(
            response.map((achievement) => ({
              ...achievement.dataValues,
              unlocked: achievement.unlocked,
            }))
          );
        })
        .catch((error) => {
          setError(
            "Algo salió mal al cargar la página. Por favor, intentalo de nuevo."
          );
        });
    };

    fetchData();
  }, []);

  return (
    <div className="achievement-page">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <div className="achievement-list">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement ${
              achievement.unlocked ? "unlocked" : "locked"
            }`}
          >
            <img src={achievement.badge_url} alt={achievement.name} />
            <div className="achievement-text">
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="achievement-page-button">
        <button className="button-basic" onClick={handleButtonClick}>
          Volver a inicio
        </button>
      </div>
    </div>
  );
}
