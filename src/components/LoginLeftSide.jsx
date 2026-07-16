import Aurora from "./Aurora";

const LoginLeftSide = () => {
  return (
    <div className="flex w-full md:w-1/2 relative overflow-hidden bg-[#120F17] min-h-[50vh] md:min-h-screen md:border-r md:border-violet-200">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#7C3AED", "#A855F7", "#10B981"]}
        blend={0.6}
        amplitude={1.2}
        speed={0.6}
      />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center md:items-start justify-center w-full h-full px-6 py-12 sm:px-8 md:px-10 lg:px-16 xl:px-20 text-center md:text-left">
        <h1 className="font-extrabold text-white leading-tight tracking-tight drop-shadow-lg transition-all duration-700 ease-out animate-fade-in">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Employix
          </span>

          <span className="block mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-violet-100">
            Management System
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg font-light text-violet-50/95 leading-7 sm:leading-8 transition-all duration-700 ease-out animate-slide-up">
          Streamline your workforce with a smarter way to manage employees,
          attendance, payroll, and leave requests. Employix empowers modern
          teams with an intuitive, secure, and efficient management experience.
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;