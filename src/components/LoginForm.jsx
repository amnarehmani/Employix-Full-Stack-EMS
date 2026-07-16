import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  EyeClosedIcon,
  EyeIcon,
} from "lucide-react";
import { LoaderIcon } from "react-hot-toast";

import LoginLeftSide from "./LoginLeftSide";

const LoginForm = ({ role, title, subtitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Your login logic goes here.
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back Button */}
          <Link
            to="/login"
            className="
              inline-flex items-center gap-2
              text-slate-500
              hover:text-violet-600
              text-sm
              mb-10
              transition-all duration-300
              hover:-translate-x-1
            "
          >
            <ArrowLeftIcon size={16} />
            Back to Portals
          </Link>

          {/* Header */}
          <div className="mb-10 text-center md:text-left animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3 transition-all duration-700">
              {title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="
                mb-6
                rounded-xl
                border border-rose-200
                bg-rose-50
                p-4
                flex items-start gap-3
                text-sm text-rose-700
                animate-slide-up
              "
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="animate-slide-up">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="employee@example.com"
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm sm:text-base

                  transition-all duration-300

                  focus:outline-none
                  focus:border-violet-500
                  focus:ring-4
                  focus:ring-violet-100
                  focus:bg-white
                "
              />
            </div>

            {/* Password Field */}
            <div className="animate-slide-up">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="
                    w-full
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    px-4 py-3
                    pr-11
                    text-sm sm:text-base

                    transition-all duration-300

                    focus:outline-none
                    focus:border-violet-500
                    focus:ring-4
                    focus:ring-violet-100
                    focus:bg-white
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-slate-400
                    hover:text-violet-600
                    transition-all duration-300
                  "
                >
                  {showPassword ? (
                    <EyeClosedIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                flex items-center justify-center gap-2

                rounded-xl
                px-5
                py-3.5

                text-sm sm:text-base
                font-semibold
                text-white

                bg-gradient-to-r
                from-violet-600
                to-emerald-500

                hover:from-violet-700
                hover:to-emerald-600

                shadow-lg
                shadow-violet-500/20

                transition-all duration-300

                hover:-translate-y-1
                hover:shadow-xl

                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
              "
            >
              {loading && (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              )}

              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;