import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  PlayCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function StudyPlan() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [examDate, setExamDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [error, setError] = useState("");

  const fetchRoadmap = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `http://127.0.0.1:8000/api/goals/${goalId}/roadmap`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch study plan");
      const data = await res.json();
      setRoadmap(data.roadmap || []);

      const goalRes = await fetch("http://127.0.0.1:8000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (goalRes.ok) {
        const goals = await goalRes.json();
        const currentGoal = goals.find((g) => g.id === parseInt(goalId));
        if (currentGoal) {
          setGoalName(currentGoal.goal_name);
          setExamDate(currentGoal.exam_date);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [goalId]);

  const updateStatus = async (itemId, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://127.0.0.1:8000/api/goals/${goalId}/roadmap/${itemId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: new URLSearchParams({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      setRoadmap((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Could not update status. Please try again.");
    }
  };

  const handleReschedule = async () => {
    setRescheduling(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://127.0.0.1:8000/api/goals/${goalId}/reschedule`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Reschedule failed");
      const data = await res.json();
      setRoadmap(data.roadmap || []);
      alert("Study plan rescheduled successfully!");
    } catch (err) {
      console.error("Reschedule error:", err);
      alert("Could not reschedule. Please try again.");
    } finally {
      setRescheduling(false);
    }
  };

  // Calculate overall progress
  const totalItems = roadmap.length;
  const completedItems = roadmap.filter((i) => i.status === "completed").length;
  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Calculate if behind schedule
  const remainingItems = roadmap.filter((i) => i.status !== "completed");
  const totalRemainingDays = remainingItems.reduce(
    (sum, item) => sum + (item.end_day_offset - item.start_day_offset + 1),
    0
  );

  const today = new Date();
  const exam = examDate ? new Date(examDate) : null;
  const daysUntilExam = exam
    ? Math.max(0, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)))
    : 0;

  const isBehindSchedule = daysUntilExam > 0 && totalRemainingDays > daysUntilExam;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          badgeClass: "bg-green-100 text-green-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "in_progress":
        return {
          label: "In Progress",
          badgeClass: "bg-blue-100 text-blue-700",
          icon: <PlayCircle className="w-4 h-4" />,
        };
      default:
        return {
          label: "Pending",
          badgeClass: "bg-gray-100 text-gray-600",
          icon: <Circle className="w-4 h-4" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading study plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
                {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                {goalName || "Your Study Roadmap"}
              </h1>
              <p className="text-gray-500">
                {progressPercent === 100
                  ? "🎉 All topics completed! Great job!"
                  : "Track your progress topic by topic."}
              </p>
            </div>
            {progressPercent < 100 ? (
              <button
                onClick={handleReschedule}
                disabled={rescheduling}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${rescheduling ? "animate-spin" : ""}`}
                />
                {rescheduling ? "Rescheduling..." : "Reschedule Plan"}
              </button>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                ✅ Completed
              </span>
            )}
          </div>
        </div>

        {/* Behind Schedule Warning */}
        {isBehindSchedule && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-800">
                You're behind schedule!
              </p>
              <p className="text-sm text-orange-700 mt-1">
                You need <strong>{totalRemainingDays} days</strong> to finish
                remaining topics, but only{" "}
                <strong>{daysUntilExam} days</strong> left until the exam. Click
                "Reschedule Plan" to redistribute your time.
              </p>
            </div>
          </div>
        )}

        {/* Overall Progress */}
        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-gray-600">
              {completedItems} / {totalItems} topics completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">
            {progressPercent}%
          </p>
        </div>

        {/* Roadmap Items */}
        {roadmap.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-gray-500">
              No roadmap items found for this goal.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {roadmap.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow ${
                    item.status === "completed" ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <h3
                        className={`text-lg font-semibold ${
                          item.status === "completed"
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.topic}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        item.difficulty
                      )}`}
                    >
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-11">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Day {item.start_day_offset + 1}
                        {item.start_day_offset !== item.end_day_offset &&
                          ` - Day ${item.end_day_offset + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.daily_hours} hrs/day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">
                        Priority: {item.priority_score}/3
                      </span>
                    </div>
                  </div>

                  {/* Status Badge + Actions */}
                  <div className="mt-4 ml-11 flex items-center gap-3 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig.badgeClass}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>

                    {item.status !== "completed" && (
                      <div className="flex gap-2">
                        {item.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(item.id, "pending")}
                            className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            Mark Pending
                          </button>
                        )}
                        {item.status !== "in_progress" && (
                          <button
                            onClick={() => updateStatus(item.id, "in_progress")}
                            className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            Start
                          </button>
                        )}
                        {item.status !== "completed" && (
                          <button
                            onClick={() => updateStatus(item.id, "completed")}
                            className="text-xs px-2 py-1 rounded border border-green-300 text-green-600 hover:bg-green-50"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}