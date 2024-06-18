import React from 'react';
import bg from '../assets/BG.jpg';
import grid from '../assets/GRID.svg';

const Onboarding: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <img
        src={bg}
        alt=""
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        width="1308"
      />
      <div
        className="absolute inset-0 bg-center"
        style={{
          backgroundImage: `url(${grid})`,
          maskImage: 'linear-gradient(180deg, white, rgba(255, 255, 255, 0))',
        }}
      ></div>
      
      <div className="relative mt-auto px-6 pt-10 pb-8 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 ">
        <div className="mx-auto max-w-md">
          <div className="text-black text-3xl md:text-5xl mb-2">
            Your ultimate<br className="md:hidden" />sports companion
          </div>
          <div className="text-black text-sm md:text-base mb-4 font-light text-left">
            Stay in the loop with live matches,<br className="md:hidden" />coach updates & more
          </div>
          <button className="bg-black text-white px-4 md:px-8 py-2 md:py-3 rounded-[8px] mb-4 w-full">
            Get Started
          </button>
          <div className="text-black text-sm text-left font-normal">
            Already have an account? <span className="font-bold">Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
