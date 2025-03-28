import { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { isEmail } from "validator"; 

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(""); 

  const onSubmit = async (data) => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/register",
        data
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4edf3]">
      {/* Left: Register Form */}
      <div className="w-full lg:w-1/2 p-8 flex justify-center items-center">
        <div className="bg-[#f4edf3] p-8 rounded  max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4  text-black">Register</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 text-[#6e66f3]">Name</label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: "Name is required",
                })}
                className="w-full p-2 border border-[#cbcefc] rounded mx-auto"
              />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 text-[#6e66f3]">Email</label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  validate: (value) => isEmail(value) || "Invalid email",
                })}
                className="w-full p-2 border border-[#cbcefc] rounded mx-auto"
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-[#6e66f3]">Password</label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full p-2 border border-[#cbcefc] rounded mx-auto"
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block mb-1 text-[#6e66f3]">Role</label>
              <select
                id="role"
                {...register("role")}
                className="w-full p-2 border border-[#cbcefc] rounded mx-auto"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#fc875e] text-white p-2 rounded w-full mx-auto block hover:bg-[#6e66f3]"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-[#6e66f3]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#fc875e] hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block w-1/2 h-screen">
        <img 
          src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?cs=srgb&dl=pexels-fauxels-3184306.jpg&fm=jpg" 
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}

export default Register;
