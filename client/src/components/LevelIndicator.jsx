import React, { useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useAuth } from "../context/AuthContext";
import { getRequiredPointsForNextLevel } from "../hooks/useLevel";

import "../styles/levelIndicator.css";

export function LevelIndicator() {
  const { user } = useAuth();
  const [currentLevelData, setCurrentLevelData] = useState(null);
  const [nextLevelData, setNextLevelData] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await getRequiredPointsForNextLevel(user.level);
        setCurrentLevelData(response.current_level);
        setNextLevelData(response.next_level);
        updateProgress(
          user.experience_points,
          response.current_level.required_points,
          response.next_level.required_points
        );
      } catch (error) {
        console.error("Error fetching level data:", error);
      }
    };

    if (user.level) {
      fetchLevelData();
    }
  }, [user.level, user.experience_points]);

  const updateProgress = (
    currentPoints,
    currentLevelRequiredPoints,
    nextLevelRequiredPoints
  ) => {
    const levelProgress = currentPoints - currentLevelRequiredPoints;
    const levelRange = nextLevelRequiredPoints - currentLevelRequiredPoints;
    const progressPercentage = (levelProgress / levelRange) * 100;
    setProgress(progressPercentage);
  };

  return (
    <div className="level-indicator-container">
      <div className="level-indicator-number">{user.level}</div>
      <div className="level-indicator-progress-bar">
        {currentLevelData && nextLevelData && (
          <ProgressBar completed={progress} bgColor="#6EDB9E" />
        )}
      </div>
    </div>
  );
}
