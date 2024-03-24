import { instance } from "./axiosInstance";

export async function getClassRanking(classId, role) {
  return await instance
    .get(`/classes/ranking/${classId}/${role}`)
    .then((response) => response.data)
    .catch((error) => console.error("Error al obtener el ranking:", error));
}
