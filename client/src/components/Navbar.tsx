import { useContext, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Navbar: FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Login must be used within an AppContextProvider');
  }

  const { userData, backendUrl, isLoggedIn, setIsLoggedIn, setUserData } = context;
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-10">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 transition-transform hover:scale-105 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {userData ? (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-600 rounded-full" />

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {userData && !userData.isVerified && (
                <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li>
              )}
              <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-sm"
          onClick={() => navigate('/login')}
        >
          Login
          <img
            src={assets.arrow_icon}
            alt="arrow"
            className="w-4 transition-transform group-hover:translate-x-1"
          />
        </button>
      )}
    </div>
  );
};

export default Navbar;
