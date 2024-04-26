import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { getClassRanking } from "../hooks/useRanking";

import { studentColumns, teacherColumns } from "../utils/rankingTableConfig";

import { useAuth } from "../context/AuthContext";

import "../styles/ranking.css";

export function Ranking({ classId }) {
  const { uid, uRole, token } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const rankingData = await getClassRanking(classId, uRole, token);

        const sortedRanking = rankingData
          .slice()
          .sort((a, b) => b.weightedValue - a.weightedValue);

        setRanking(sortedRanking);

        if (uid) {
          const userIndex = sortedRanking.findIndex(
            (record) => record.userId === uid
          );

          if (userIndex !== -1) {
            // Calcular la página correspondiente al usuario
            const userPage = Math.ceil((userIndex + 1) / pageSize);
            setCurrentPage(userPage);
          }
        }
      } catch (error) {
        console.error("Error loading ranking", error);
      }
    };

    loadRanking();
  }, [classId, uid, pageSize]);

  // Agregar posición al ranking
  const rankedData = ranking.map((student, index) => ({
    ...student,
    position: index + 1,
  }));

  // Función para agregar clase condicional a la fila
  const rowClassName = (record) => {
    return uid && record.userId === uid ? "highlight-row" : "";
  };

  return (
    <div className="ranking-table-container">
      <h1>Ranking</h1>
      <div className="ranking-table-scrollable">
        <Table
          dataSource={rankedData}
          columns={uRole === "profesor" ? teacherColumns : studentColumns}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: setCurrentPage,
          }}
          rowKey={(record) => record.userId}
          rowClassName={rowClassName}
        />
      </div>
    </div>
  );
}
