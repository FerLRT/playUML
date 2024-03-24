export const teacherColumns = [
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

export const studentColumns = [
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
    title: "Puntuación Ranking",
    dataIndex: "weightedValue",
    key: "weightedValue",
    width: 100,
    sorter: (a, b) => a.weightedValue - b.weightedValue,
    render: (weightedValue) => weightedValue.toFixed(2),
    defaultSortOrder: "descend", // Orden descendente por defecto
  },
];
