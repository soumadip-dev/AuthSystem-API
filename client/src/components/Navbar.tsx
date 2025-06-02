import type { FC } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-10">
      <img
        src={assets.logo}
        alt="logo"
        className="w-[80px] sm:w-24 transition-transform hover:scale-105 cursor-pointer"
      />
      <button
        className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-sm"
        onClick={() => navigate('/login')}
      >
        Login{' '}
        <img
          src={assets.arrow_icon}
          alt="arrow"
          className="w-4 transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );
};

export default Navbar;
