import { useState, type FC } from 'react';
import { assets } from '../assets/assets';

const Login: FC = () => {
  const [state, setState] = useState<'signup' | 'login'>('signup');

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-100 to-purple-400 animate-gradient">
      <img
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer transition-transform hover:scale-105"
      />

      <div className="bg-slate-900/90 backdrop-blur-sm p-8 sm:p-10 rounded-xl shadow-2xl w-full sm:w-96 text-indigo-200 transition-all duration-300 hover:shadow-purple-500/20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text ">
            {state === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-indigo-300/80">
            {state === 'signup' ? 'Join us today!' : 'Login to continue your journey'}
          </p>
        </div>

        <form className="space-y-4">
          {state === 'signup' && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 transition-all duration-300 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500">
              <img src={assets.person_icon} alt="person" className="w-4 opacity-80" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
              />
            </div>
          )}

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 transition-all duration-300 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500">
            <img src={assets.mail_icon} alt="email" className="w-4 opacity-80" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
            />
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 transition-all duration-300 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500">
            <img src={assets.lock_icon} alt="password" className="w-4 opacity-80" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
            />
          </div>

          {state === 'login' && (
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            {state === 'signup' ? 'Sign Up' : 'Login'}
          </button>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              {state === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setState(state === 'signup' ? 'login' : 'signup')}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
              >
                {state === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
