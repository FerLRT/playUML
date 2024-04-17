import { instance } from "./axiosInstance";

export function getUserAchievements(userId) {
  return instance.get(`/achievements/${userId}`).then((response) => response);
}
