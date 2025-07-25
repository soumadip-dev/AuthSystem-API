import type { FC } from 'react';
import { assets } from '../assets/assets';
const Navbar: FC = () => {
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="logo" className="w-15 sm:w-20 " />
      <button className="flex items-center gap-2 border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
        Login
      </button>
    </div>
  );
};
export default Navbar;
