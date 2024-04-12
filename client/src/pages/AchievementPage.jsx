import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserAchievements } from "../hooks/useAchievement";

import "../styles/achievement.css";

export function AchievementPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const loadAchievements = async () => {
      if (user) {
        try {
          const userAchievements = await getUserAchievements(user.email);
          const mappedAchievements = userAchievements.map((achievement) => ({
            ...achievement.dataValues,
            unlocked: achievement.unlocked,
          }));
          setAchievements(mappedAchievements);
        } catch (error) {
          console.error("Error loading achievements:", error);
        }
      }
    };

    loadAchievements();
  }, [user]);

  return (
    <div className="achievement-page">
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
