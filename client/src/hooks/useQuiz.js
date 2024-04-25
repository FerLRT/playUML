import { instanceWithAuth } from "./axiosInstance";

export function getQuizzes(userId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/quizzes/user/${userId}`)
    .then((response) => response);
}

export function getQuestions(quizId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/questions/${quizId}`)
    .then((response) => response.data);
}

export function getAnswers(questionId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/answers/${questionId}`)
    .then((response) => response.data);
}

export function getAnswersWithScores(questionId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/answers/scores/${questionId}`)
    .then((response) => response.data);
}

export function getQuestionImages(questionId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/images/${questionId}`)
    .then((response) => response.data);
}

export function submitAnswers(userId, quizId, answers, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .post("/answers/user", { userId, quizId, answers })
    .then((response) => response.data);
}

export function hasUserCompletedQuiz(userEmail, quizId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get("/user-quizzes/completed", { userEmail, quizId })
    .then((response) => response.data);
}

export function getClassStats(classId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/quizzes/stats/${classId}`)
    .then((response) => response);
}

export function getStudentQuizScore(userId, quizId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/user-quizzes/score/${userId}/${quizId}`)
    .then((response) => response.data);
}

export function getStudentAnswers(userId, quizId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/quizzes/${quizId}/user/${userId}`)
    .then((response) => response.data);
}

export function getChartStats(userId, quizId, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .get(`/quizzes/stats/${userId}/${quizId}`)
    .then((response) => response.data);
}
