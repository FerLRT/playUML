import { instance } from "./axiosInstance";

export async function getClassRanking(classId) {
  return await instance
    .get(`/classes/ranking/${classId}`)
    .then((response) => response.data)
    .catch((error) => console.error("Error al obtener el ranking:", error));
}
