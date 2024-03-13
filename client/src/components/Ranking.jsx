import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getClassRanking } from "../hooks/useRanking";

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
      title: "Posición",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Estudiante",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Puntuación Media",
      dataIndex: "averageScore",
      key: "averageScore",
      sorter: (a, b) => a.averageScore - b.averageScore,
      render: (averageScore) => averageScore.toFixed(2),
    },
    {
      title: "Porcentaje Completado",
      dataIndex: "completionPercentage",
      key: "completionPercentage",
      sorter: (a, b) => a.completionPercentage - b.completionPercentage,
      render: (completionPercentage) => completionPercentage.toFixed(2) + "%",
    },
    {
      title: "Puntuación Ranking",
      dataIndex: "weightedValue",
      key: "weightedValue",
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
    <div>
      <h1>Ranking</h1>
      <Table
        dataSource={rankedData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.userId}
      />
    </div>
  );
}
