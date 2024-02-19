import { instance } from "./axiosInstance";

export function getQuizzes() {
  return instance.get("/quizzes").then((response) => response.data);
}

export function getQuestions(quizId) {
  return instance.get(`/questions/${quizId}`).then((response) => response.data);
}

export function getAnswers(questionId) {
  return instance
    .get(`/answers/${questionId}`)
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
