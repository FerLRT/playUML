import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizList from "../pages/QuizList";
import Quiz from "../pages/Quiz";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<QuizList />} />
      <Route path="/quiz/:quizId" element={<Quiz />} />
    </Routes>
  </Router>
);

export default AppRoutes;
