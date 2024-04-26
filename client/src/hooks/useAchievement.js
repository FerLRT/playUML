import { instanceWithAuth } from "./axiosInstance";

export function getUserAchievements(userId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/achievements/${userId}`)
    .then((response) => response.data);
}
