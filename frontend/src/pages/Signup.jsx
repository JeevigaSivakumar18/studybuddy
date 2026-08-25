import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Signup failed");
        return;
      }

      setMessage("Account created successfully!");
      console.log(data);

    } catch (error) {
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-indigo-700 text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Start your personalized learning journey with StudyBuddy
        </p>

        <form onSubmit={handleSubmit}>

          <label className="block font-medium mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border rounded-lg p-3 mb-5"
            required
          />

          <label className="block font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border rounded-lg p-3 mb-5"
            required
          />

          <label className="block font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className="w-full border rounded-lg p-3 mb-6"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
          >
            Create Account
          </button>

        </form>

        {message && (
          <p className="text-center mt-5 text-gray-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default Signup;