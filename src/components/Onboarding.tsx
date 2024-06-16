import React from 'react';

const Onboarding: React.FC = () => {
  return (
    <div className="bg-[#051DA0] min-h-screen flex flex-col justify-end items-center p-4 text-left font-bold">
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row md:items-left gap-8">
        {/* Left Column (Empty for mobile) */}
        <div className="hidden md:flex md:w-1/2">
          {/* Optionally, you can add content or leave it empty */}
        </div>
        {/* Right Column */}
        <div className="w-full md:w-[400px]">
          <div className="text-white text-3xl md:text-5xl mb-2">
            Your ultimate<br className="md:hidden" />sports companion
          </div>
          <div className="text-white text-sm md:text-base mb-4 font-light text-left">
            Stay in the loop with live matches,<br className="md:hidden" />coach updates & more
          </div>
          <button className="bg-white text-[#051DA0] px-4 md:px-8 py-2 md:py-3 rounded-[8px] mb-4 w-full">
            Get Started
          </button>
          <div className="text-white text-sm text-left font-normal">
            Already have an account? <span className="font-bold">Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
