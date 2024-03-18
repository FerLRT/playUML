import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getClassRanking } from "../hooks/useRanking";

import "../styles/ranking.css";

export function Ranking({ classId }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const rankingData = await getClassRanking(classId);
        setRanking(rankingData);
      } catch (error) {
        console.error("Error loading ranking", error);
      }
    };

    loadRanking();
  }, [classId]);

  const columns = [
    {
      title: "Pos.",
      dataIndex: "position",
      key: "position",
      width: 10,
    },
    {
      title: "Estudiante",
      dataIndex: "userId",
      key: "userId",
      width: 100,
    },
    {
      title: "Puntuación Media",
      dataIndex: "averageScore",
      key: "averageScore",
      width: 100,
      sorter: (a, b) => a.averageScore - b.averageScore,
      render: (averageScore) => averageScore.toFixed(2),
    },
    {
      title: "Porcentaje Completado",
      dataIndex: "completionPercentage",
      key: "completionPercentage",
      width: 100,
      sorter: (a, b) => a.completionPercentage - b.completionPercentage,
      render: (completionPercentage) => completionPercentage.toFixed(2) + "%",
    },
    {
      title: "Puntuación Ranking",
      dataIndex: "weightedValue",
      key: "weightedValue",
      width: 100,
      sorter: (a, b) => a.weightedValue - b.weightedValue,
      render: (weightedValue) => weightedValue.toFixed(2),
      defaultSortOrder: "descend", // Orden descendente por defecto
    },
  ];

  // Ordenar el ranking por la columna "Puntuación Ranking"
  const sortedRanking = ranking
    .slice()
    .sort((a, b) => b.weightedValue - a.weightedValue);

  // Agregar posición al ranking
  const rankedData = sortedRanking.map((student, index) => ({
    ...student,
    position: index + 1,
  }));

  return (
    <div className="ranking-table-container">
      <h1>Ranking</h1>
      <div className="ranking-table-scrollable">
        <Table
          dataSource={rankedData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey={(record) => record.userId}
        />
      </div>
    </div>
  );
}
