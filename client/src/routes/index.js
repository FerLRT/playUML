import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Quiz from "../pages/Quiz";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Quiz />} />
    </Routes>
  </Router>
);

export default AppRoutes;
