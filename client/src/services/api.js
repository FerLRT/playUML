import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const fetchQuestions = (quizId) => {
  return axios.get(`${BASE_URL}/questions/${quizId}`);
};

export const fetchAnswersByQuestionId = (questionId) => {
  return axios.get(`${BASE_URL}/answers/${questionId}`);
};

export const submitAnswers = (answers) => {
  return axios
    .post(`${BASE_URL}/answers/score`, { answers })
    .then((response) => {
      return response.data;
    });
};

export const fetchQuizzes = () => {
  return axios.get(`${BASE_URL}/quizzes`);
};
