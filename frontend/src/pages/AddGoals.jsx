import { useState } from "react";
import {
  Upload,
  CalendarDays,
  Clock3,
  Target,
} from "lucide-react";

function AddGoal() {
  const [formData, setFormData] = useState({
    goal_name: "",
    goal_type: "Semester Exam",
    exam_date: "",
    daily_hours: "",
    preferred_time: "",
  });

  const [syllabusFile, setSyllabusFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!syllabusFile) {
    alert("Please upload your syllabus PDF.");
    return;
  }

  const data = new FormData();

  data.append("goal_name", formData.goal_name);
  data.append("goal_type", formData.goal_type);
  data.append("exam_date", formData.exam_date);
  data.append("daily_hours", formData.daily_hours);
  data.append("preferred_time", formData.preferred_time);

  data.append("syllabus", syllabusFile);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/goals",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: data,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      alert(result.detail || "Failed to create goal");
      return;
    }

    console.log("Goal created:", result);

    alert("Goal and syllabus uploaded successfully!");

  } catch (error) {
    console.error(error);
    alert("Could not connect to the backend.");
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-10">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-indigo-700">
          Create New Goal
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Set up your learning goal and let StudyBuddy generate your
          personalized study plan.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Goal Name */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Goal Name
            </label>

            <input
              type="text"
              name="goal_name"
              value={formData.goal_name}
              onChange={handleChange}
              placeholder="Example: CAT Exam"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Goal Type */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Goal Type
            </label>

            <select
              name="goal_type"
              value={formData.goal_type}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Semester Exam</option>
              <option>Placement</option>
              <option>Competitive Exam</option>
              <option>Certification</option>
              <option>Custom</option>
            </select>
          </div>

          {/* Exam Date */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Goal Due
            </label>

            <div className="relative">

              <CalendarDays
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="date"
                name="exam_date"
                value={formData.exam_date}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

            </div>
          </div>

          {/* Daily Hours */}
          <div className="mb-6">

            <label className="block font-medium mb-2">
              Daily Study Hours
            </label>

            <div className="relative">

              <Clock3
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="number"
                name="daily_hours"
                value={formData.daily_hours}
                onChange={handleChange}
                min="1"
                max="12"
                placeholder="3"
                className="w-full border rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

            </div>
          </div>

          {/* Preferred Time */}
          <div className="mb-6">

            <label className="block font-medium mb-3">
              Preferred Study Time
            </label>

            <div className="grid grid-cols-3 gap-4">

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    preferred_time: "Morning",
                  })
                }
                className={`border rounded-lg py-3 transition ${
                  formData.preferred_time === "Morning"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : "hover:bg-indigo-50 hover:border-indigo-500"
                }`}
              >
                🌅 Morning
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    preferred_time: "Afternoon",
                  })
                }
                className={`border rounded-lg py-3 transition ${
                  formData.preferred_time === "Afternoon"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : "hover:bg-indigo-50 hover:border-indigo-500"
                }`}
              >
                ☀️ Afternoon
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    preferred_time: "Night",
                  })
                }
                className={`border rounded-lg py-3 transition ${
                  formData.preferred_time === "Night"
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : "hover:bg-indigo-50 hover:border-indigo-500"
                }`}
              >
                🌙 Night
              </button>

            </div>

          </div>

          {/* Upload Syllabus */}
          <div className="mb-8">

            <label className="block font-medium mb-3">
              Upload Syllabus
            </label>

            <label className="border-2 border-dashed rounded-xl h-40 flex flex-col justify-center items-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">

              <Upload
                size={36}
                className="text-indigo-600"
              />

              <p className="mt-3 font-medium">
                Click to Upload PDF
              </p>

              <p className="text-sm text-gray-500">
                PDF files only
              </p>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setSyllabusFile(e.target.files[0])}
              />

            </label>

          </div>

          {/* AI Summary */}
          <div className="bg-slate-50 rounded-xl p-5 mb-8">

            <div className="flex items-center gap-2 mb-3">

              <Target className="text-indigo-600" />

              <h2 className="font-semibold text-lg">
                AI will generate
              </h2>

            </div>

            <ul className="list-disc ml-6 text-gray-600 space-y-2">

              <li>Topic extraction from syllabus</li>

              <li>Difficulty assessment</li>

              <li>Personalized study roadmap</li>

              <li>Daily study schedule</li>

              <li>Adaptive plan based on progress</li>

            </ul>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Generate AI Study Plan
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddGoal;