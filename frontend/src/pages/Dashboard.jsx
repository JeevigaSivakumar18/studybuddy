import { useNavigate } from "react-router-dom";
import { Target, Plus } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-indigo-700 mb-2">
        Welcome to StudyBuddy
      </h1>
      <p className="text-gray-500 mb-8 text-lg">
        Your AI-powered study planner
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/goals")}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          <Target className="w-5 h-5" />
          My Goals
        </button>
        <button
          onClick={() => navigate("/addgoal")}
          className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </button>
      </div>
    </div>
  );
}

export default Dashboard;