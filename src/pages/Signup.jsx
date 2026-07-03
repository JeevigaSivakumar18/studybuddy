import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <div className="bg-white w-96 rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-purple-700">
          StudyBuddy
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create Account
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-purple-600"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-purple-600"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-purple-600"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 rounded-lg mb-6 outline-none focus:border-purple-600"
        />

        <button
          className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800 transition"
        >
          Create Account
        </button>

        <p className="text-center mt-5">

          Already have an account?

          <Link
            to="/"
            className="text-purple-700 ml-2 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;