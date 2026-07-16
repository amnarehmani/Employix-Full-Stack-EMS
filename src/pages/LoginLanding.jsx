import {
  ArrowBigRightIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import LoginLeftSide from "../components/LoginLeftSide";

const LoginLanding = () => {
  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      subtitle:
        "Sign in to manage the organization, employees, departments, payroll and system settings.",
      icon: ShieldIcon,
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      subtitle:
        "Sign in to access your account, view payslips, attendance, leave requests and more.",
      icon: UserIcon,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/* Header */}
          <div className="mb-10 text-center md:text-left animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3 transition-all duration-700">
              Welcome Back to Employix
            </h2>

            <p className="text-slate-600 text-sm sm:text-base">
              Select your portal to securely access your system.
            </p>
          </div>

          {/* Portal List */}
          <div className="space-y-4">
            {portalOptions.map((portal) => {
              const Icon = portal.icon;

              return (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className="
                    group block
                    bg-slate-50
                    border border-slate-200
                    rounded-xl
                    p-5 sm:p-6
                    transition-all duration-300 ease-in-out
                    hover:-translate-y-1
                    hover:shadow-xl
                    hover:border-violet-400
                    hover:bg-violet-50
                    animate-slide-up
                  "
                >
                  <div className="flex items-center justify-between gap-4 sm:gap-5">
                    <div className="flex items-start gap-4">
                      <Icon
                        className="
                          w-6 h-6
                          text-slate-600
                          mt-1
                          transition-all duration-300
                          group-hover:text-violet-600
                          group-hover:scale-110
                        "
                      />

                      <div>
                        <h3
                          className="
                            text-lg font-semibold text-slate-900
                            transition-all duration-300
                            group-hover:text-violet-600
                          "
                        >
                          {portal.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                          {portal.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowBigRightIcon
                      className="
                        w-5 h-5
                        text-slate-400
                        transition-all duration-300
                        group-hover:text-violet-600
                        group-hover:translate-x-2
                      "
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
        <div className="flex justify-center items-center mt-12 text-center text-sm text-slate-500 animate-slide-up">
  <p>
    © {new Date().getFullYear()} Employix. All rights reserved.
  </p>
</div>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;