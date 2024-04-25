import React, { useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useAuth } from "../context/AuthContext";
import { getRequiredPointsForNextLevel } from "../hooks/useLevel";

import "../styles/levelIndicator.css";

export function LevelIndicator({ posiblePoints }) {
  const { user, token } = useAuth();
  const [progress, setProgress] = useState(0);

  const [maxPosibleProgress, setMaxPosibleProgress] = useState(0);

  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentLevelRequiredPoints, setCurrentLevelRequiredPoints] =
    useState(0);
  const [nextLevelRequiredPoints, setNextLevelRequiredPoints] = useState(0);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await getRequiredPointsForNextLevel(user.level, token);
        updateProgress(
          user.experience_points,
          response.current_level.required_points,
          response.next_level.required_points
        );

        setCurrentPoints(user.experience_points);
        setCurrentLevelRequiredPoints(response.current_level.required_points);
        setNextLevelRequiredPoints(response.next_level.required_points);
      } catch (error) {
        console.error("Error fetching level data:", error);
      }
    };

    if (user) {
      fetchLevelData();
    }
  }, [user]);

  useEffect(() => {
    if (posiblePoints !== undefined) {
      const posibleLevelProgress = posiblePoints - currentLevelRequiredPoints;
      const levelRange = nextLevelRequiredPoints - currentLevelRequiredPoints;
      const posibleProgressPercentage =
        (posibleLevelProgress / levelRange) * 100;
      setMaxPosibleProgress(posibleProgressPercentage);
    }
  }, [
    currentPoints,
    currentLevelRequiredPoints,
    nextLevelRequiredPoints,
    posiblePoints,
  ]);

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
      {user && <div className="level-indicator-number">{user.level}</div>}
      <div className="progress-container">
        <ProgressBar
          completed={maxPosibleProgress || 0}
          bgColor="rgba(110, 219, 158, 0.2)"
          width="100%"
          borderRadius="10px"
          height="20px"
          isLabelVisible={false}
          className="progress-bar overlay"
        />
        <ProgressBar
          completed={progress}
          bgColor="rgba(110, 219, 158, 1)"
          baseBgColor="transparent"
          width="100%"
          borderRadius="10px"
          height="20px"
          isLabelVisible={false}
          className="progress-bar base"
        />
      </div>
    </div>
  );
}
