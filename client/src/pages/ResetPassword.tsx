import { useContext, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [email, setEmail] = useState('');

  if (!context) {
    throw new Error('ResetPassword must be used within an AppContextProvider');
  }
  const { userData, isLoggedIn } = context;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Submit logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-100 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:scale-105 transition-transform"
      />

      <div className="bg-slate-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl w-full sm:w-96 text-indigo-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text">
            Reset Password
          </h2>
          <p className="text-sm text-indigo-300/80">Enter your email to receive a reset link</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <img
              src={assets.mail_icon}
              alt="mail"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full pl-12 pr-4 py-3 bg-[#333A5C]/80 text-white rounded-xl focus:bg-[#333A5C] focus:ring-2 focus:ring-indigo-500 outline-none placeholder-indigo-300/70"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
