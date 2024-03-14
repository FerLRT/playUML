import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "../context/AuthContext";

import { getChartStats } from "../hooks/useQuiz";

export function ScoreDistributionChart({ userScore }) {
  const { user } = useAuth();
  const { quizId } = useParams();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchScoreDistributionData = async () => {
      try {
        // Hacer la petición al servidor para obtener los datos de distribución de puntajes
        const stats = await getChartStats(user.id, quizId);
        setChartData(stats); // Suponiendo que la respuesta contiene los datos en la forma necesaria para el gráfico
      } catch (error) {
        console.error("Error fetching score distribution data:", error);
      }
    };

    fetchScoreDistributionData();
  }, [user.id, quizId]);

  const customTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const { score, percentage, numStudents } = payload[0].payload;
      return (
        <div style={{ backgroundColor: "#fff", padding: "5px" }}>
          <p>{`Porcentaje de estudiantes: ${percentage}%`}</p>
          <p>{`Estudiantes: ${numStudents}`}</p>
        </div>
      );
    }
    return null;
  };

  const coloredBars = chartData.map((entry) => ({
    ...entry,
    fill: entry.score === Math.round(userScore) ? "orange" : "#8884d8",
  }));

  // Completar las puntuaciones faltantes con un porcentaje de 0
  const completeChartData = Array.from({ length: 10 }, (_, i) => {
    const score = i + 1;
    const existingEntry = coloredBars.find((entry) => entry.score === score);
    return existingEntry
      ? existingEntry
      : { score, percentage: 0, numStudents: 0 };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={completeChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score" />
        <YAxis tickFormatter={(tick) => `${tick}%`} />
        <Tooltip content={customTooltip} />
        <Bar dataKey="percentage" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
