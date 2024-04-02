import { instance } from "./axiosInstance";

export function getQuizzes(userId) {
  return instance
    .get(`/quizzes/user/${userId}`)
    .then((response) => response.data);
}

export function getQuestions(quizId) {
  return instance.get(`/questions/${quizId}`).then((response) => response.data);
}

export function getAnswers(questionId) {
  return instance
    .get(`/answers/${questionId}`)
    .then((response) => response.data);
}

export function getAnswersWithScores(questionId) {
  return instance
    .get(`/answers/scores/${questionId}`)
    .then((response) => response.data);
}

export function getQuestionImages(questionId) {
  return instance
    .get(`/images/${questionId}`)
    .then((response) => response.data);
}

// Enviar las respuestas del usuario
// Recibir la puntuación de cada respuesta
export function submitAnswers(userEmail, quizId, answers) {
  return instance
    .post("/answers/user", { userEmail, quizId, answers })
    .then((response) => response.data);
}

export function hasUserCompletedQuiz(userEmail, quizId) {
  return instance
    .post("/user-quizzes/completed", { userEmail, quizId })
    .then((response) => response.data);
}

export function getClassStats(classId) {
  return instance
    .get(`/quizzes/stats/${classId}`)
    .then((response) => response.data);
}

export function getStudentQuizScore(userId, quizId) {
  return instance
    .get(`/user-quizzes/score/${userId}/${quizId}`)
    .then((response) => response.data);
}

export function getStudentAnswers(userId, quizId) {
  return instance
    .get(`/quizzes/${quizId}/user/${userId}`)
    .then((response) => response.data);
}

export function getChartStats(userId, quizId) {
  return instance
    .get(`/quizzes/stats/${userId}/${quizId}`)
    .then((response) => response.data);
}
