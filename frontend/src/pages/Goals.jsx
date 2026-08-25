import { useEffect, useState } from "react";
import { Plus, Target, CalendarDays, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";


function Goals() {

  

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGoals = async () => {

    const token = localStorage.getItem("access_token");

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/goals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setGoals(data);
      }

    } catch (error) {
      console.error("Error fetching goals:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              My Goals
            </h1>

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

        {/* Loading */}

        {loading && (
          <p className="text-gray-500">
            Loading your goals...
          </p>
        )}

        {/* No goals */}

        {!loading && goals.length === 0 && (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <Target
              size={48}
              className="mx-auto text-indigo-500"
            />

            <h2 className="text-xl font-semibold mt-4">
              No goals yet
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first learning goal to get started.
            </p>

          </div>

        )}

        {/* Goals */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {goals.map((goal) => (

            <div
              key={goal.id}
              className="bg-white rounded-2xl shadow p-6"
            >

              <div className="flex items-center gap-3 mb-4">

                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Target
                    className="text-indigo-600"
                    size={22}
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-lg">
                    {goal.goal_name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {goal.goal_type}
                  </p>
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
                    style={{
                      width: `${goal.progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Goals;