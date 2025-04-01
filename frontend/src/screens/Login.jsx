import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/login",
        formData
      );

      dispatch(setCredentials(response.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="bg-[#f4edf3] flex justify-center items-center h-screen">
      {/* Left: Image */}
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?cs=srgb&dl=pexels-fauxels-3184306.jpg&fm=jpg"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Login Form */}
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1
          className="text-4xl font-extrabold text-[#fc875e] uppercase tracking-wide relative text-center
      before:content-['']   hover:before:scale-x-100 drop-shadow-lg"
        >
          Level{" "}
          <span className="text-white bg-[#fc875e] px-2 py-1 rounded-lg shadow-md">
            Up
          </span>
        </h1>{" "}
        <br />
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#6e66f3]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#6e66f3]"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-[#6e66f3]">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-[#6e66f3]"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="text-[#fc875]"
            />
            <label htmlFor="remember" className="text-[#6e66f3] ml-2">
              Remember Me
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-[#6e66f3]">
            <Link to="#" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-[#fc875e] hover:bg-[#6e66f3] text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button>
        </form>
        {/* Sign up Link */}
        <div className="mt-6 text-[#6e66f3] text-center">
          <Link to="/register" className="hover:underline">
            Dont have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
