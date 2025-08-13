import { useContext, type FC } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header: FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('Login must be used within an AppContextProvider');
  const { userData, isLoggedIn } = context;

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 animate-fadeIn">
      <img
        src={assets.header_img}
        alt="header"
        className="w-36 h-36 rounded-full mb-6 border-4 border-white/50 shadow-lg hover:scale-105 transition-transform duration-300"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hello, {isLoggedIn ? userData?.name : 'Developer'}
        <img src={assets.hand_wave} alt="hand wave" className="w-8 aspect-square animate-wiggle" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        Welcome to our app
      </h2>
      <p className="mb-8 max-w-md text-gray-700 leading-relaxed">
        Let's start with a product tour and we'll have you up and running in no time!
      </p>
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-white/80 hover:shadow-md transition-all duration-300 backdrop-blur-sm font-medium">
        Get Started
      </button>
    </div>
  );
};
export default Header;
