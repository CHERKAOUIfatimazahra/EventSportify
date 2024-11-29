import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else if (response.data.message === "OTP sent to email") {
        setStep("otp");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/verify-otp",
        {
          email: formData.email,
          otp: formData.otp,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (step === "otp") {
      return (
        <div className="w-full max-w-md space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Verify OTP
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Please enter the OTP sent to your email
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Input
              label="Enter OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />

            <Button
              loading={loading}
              className="w-full bg-[#1A2980] text-white py-3 rounded-lg hover:bg-[#26D0CE] transition transform hover:scale-[1.01] flex items-center justify-center"
            >
              Verify OTP
            </Button>
          </form>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          />

          <Button
            loading={loading}
            className="w-full bg-[#1A2980] text-white py-3 rounded-lg hover:bg-[#26D0CE] transition transform hover:scale-[1.01] flex items-center justify-center"
          >
            Sign In
          </Button>

          <div className="flex items-center justify-between">
            <div className="text-sm"></div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-medium text-gray-600 hover:text-purple-500"
              >
                Create account
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 bg-blue-50 justify-center items-center p-8">
        <img
          src="EventSportify.png"
          alt="Login illustration"
          className="max-w-md h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        {renderForm()}
      </div>
    </div>
  );
};

export default Login;
