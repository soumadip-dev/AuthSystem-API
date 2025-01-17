import { useContext, type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { logoutUser, sendVerificationEmail } from '../api/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar: FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!context) {
    throw new Error('Navbar must be used within an AppContextProvider');
  }

  const { userData, isLoggedIn, setIsLoggedIn, setUserData, isLoading } = context;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      setIsLoggedIn(false);
      setUserData(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };
  const sendVerificationOtp = async () => {
    try {
      const data = await sendVerificationEmail();
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Failed to send verification OTP:', error);
      toast.error('Failed to send verification OTP. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-10">
        <img
          src={assets.logo}
          alt="logo"
          className="w-28 sm:w-32 transition-transform hover:scale-105 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-10">
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 sm:w-32 transition-transform hover:scale-105 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {isLoggedIn && userData ? (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-600 rounded-full" />

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isVerified && (
                <li
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  onClick={sendVerificationOtp}
                >
                  Verify email
                </li>
              )}
              <li
                className={`py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 ${
                  isLoggingOut ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={isLoggingOut ? undefined : handleLogout}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-sm group"
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
