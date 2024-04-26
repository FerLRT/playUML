import { instanceWithAuth } from "./axiosInstance";

export async function getClassRanking(classId, role, token) {
  const instance = instanceWithAuth(token);
  return await instance
    .get(`/classes/ranking/${classId}/${role}`)
    .then((response) => response.data)
    .catch((error) => console.error("Error al obtener el ranking:", error));
}
