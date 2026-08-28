import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AddGoal from "../pages/AddGoals";
import Goals from "../pages/Goals";
import StudyPlan from "../pages/StudyPlan";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/addgoal" element={<AddGoal />} />

      <Route path="/goals" element={<Goals />} />

      <Route path="/study-plan/:goalId" element={<StudyPlan />} />

    </Routes>
  );
}

export default AppRoutes;