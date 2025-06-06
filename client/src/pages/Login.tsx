import { useState, type FC } from 'react';
import { assets } from '../assets/assets';

const Login: FC = () => {
  const [state, setState] = useState('signup');
  return (
    <div className="flex items-center justify-center h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className=" bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96  text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold mb-3 text-white text-center">
          {state === 'signup' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-sm mb-6 text-center">
          {state === 'signup' ? 'Create Your Account' : 'Login to your account'}
        </p>
        <form>
          {state === 'signup' && (
            <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="person" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none"
              />
            </div>
          )}
          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="person" />
            <input
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="person" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
            />
          </div>

          <p className="mb-4 text-indigo-500 cursor-pointer">Forgot Password?</p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state === 'signup' ? 'Sign Up' : 'Login'}
          </button>

          {state === 'signup' ? (
            <p className="mt-4 text-center text-gray-400 text-xs">
              Already have an account?{' '}
              <span
                className="cursor-pointer text-blue-400 underline"
                onClick={() => setState('login')}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="mt-4 text-center text-gray-400 text-xs">
              Don't have an account?{' '}
              <span
                className="cursor-pointer text-blue-400 underline"
                onClick={() => setState('signup')}
              >
                Sign Up
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
export default Login;
