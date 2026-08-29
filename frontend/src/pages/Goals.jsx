import { useEffect, useState } from "react";
import { Plus, Target, CalendarDays, Clock3, BookOpen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (goalId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/api/goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete goal");

      // Remove from local state so UI updates instantly
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete goal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">My Goals</h1>
            <p className="text-gray-500 mt-1">
              Track and manage your learning goals
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold"
            onClick={() => navigate("/addgoal")}
          >
            <Plus size={20} />
            Add Goal
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading your goals...</p>}

        {!loading && goals.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <Target size={48} className="mx-auto text-indigo-500" />
            <h2 className="text-xl font-semibold mt-4">No goals yet</h2>
            <p className="text-gray-500 mt-2">
              Create your first learning goal to get started.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-2xl shadow p-6 relative">
              {/* Delete button */}
              <button
                onClick={() => handleDelete(goal.id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Target className="text-indigo-600" size={22} />
                </div>
                <div className="pr-8">
                  <h2 className="font-semibold text-lg">{goal.goal_name}</h2>
                  <p className="text-sm text-gray-500">{goal.goal_type}</p>
                </div>
              </div>

              <div className="space-y-3 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  Due: {goal.exam_date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {goal.daily_hours} hours/day
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* View Study Plan Button */}
              <button
                onClick={() => navigate(`/study-plan/${goal.id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                View Study Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Goals;