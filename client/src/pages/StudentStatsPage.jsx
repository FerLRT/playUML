import React from "react";
import { useParams } from "react-router-dom";

export function StudentStatsPage() {
  const { studentId } = useParams();

  return (
    <div>
      <h1>StudentStatsPage</h1>
      <h2>Student ID: {studentId}</h2>
    </div>
  );
}
