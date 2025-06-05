import { useState, type FC } from 'react';
import { assets } from '../assets/assets';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password strength checks
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noSpaces: !/\s/.test(password),
  };

  // Calculate strength percentage (16.66% per criteria)
  const strength = Math.round((Object.values(passwordChecks).filter(Boolean).length / 6) * 100);

  // Get strength label with color
  const getStrengthLabel = () => {
    if (strength === 100) return { text: 'Very Strong', color: 'text-emerald-400' };
    if (strength >= 80) return { text: 'Strong', color: 'text-green-400' };
    if (strength >= 60) return { text: 'Good', color: 'text-blue-400' };
    if (strength >= 40) return { text: 'Weak', color: 'text-yellow-400' };
    return { text: 'Very Weak', color: 'text-red-400' };
  };

  // Get strength meter color
  const getStrengthMeterColor = () => {
    if (strength === 100) return 'bg-emerald-400';
    if (strength >= 80) return 'bg-green-400';
    if (strength >= 60) return 'bg-blue-400';
    if (strength >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-100 to-purple-400 animate-gradient">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer transition-transform hover:scale-105 hover:drop-shadow-lg"
      />

      <div className="bg-slate-900/90 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-200 transition-all duration-300 hover:shadow-purple-500/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            {state === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-indigo-300/80 animate-pulse">
            {state === 'signup' ? 'Join us today!' : 'Login to continue your journey'}
          </p>
        </div>

        <form className="space-y-5">
          {state === 'signup' && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 transition-all duration-300 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-[#333A5C]/90">
              <img src={assets.person_icon} alt="person" className="w-4 opacity-80" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 transition-all duration-300 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-[#333A5C]/90">
            <img src={assets.mail_icon} alt="email" className="w-4 opacity-80" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 transition-all duration-300 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-[#333A5C]/90">
            <img src={assets.lock_icon} alt="password" className="w-4 opacity-80" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Meter (only shown during signup) */}
          {state === 'signup' && (
            <div className="mt-2 animate-fadeIn">
              <div className="flex justify-between text-xs text-indigo-300">
                <span>Password strength</span>
                <span className={`${getStrengthLabel().color} font-medium`}>
                  {getStrengthLabel().text}
                </span>
              </div>
              <div className="w-full h-1.5 bg-indigo-900/70 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getStrengthMeterColor()} transition-all duration-500`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>

              {/* Password Requirements */}
              <ul className="mt-3 text-xs text-indigo-300/80 space-y-1">
                <li
                  className={`flex items-center gap-1 ${
                    passwordChecks.length ? 'text-emerald-400' : ''
                  }`}
                >
                  <span>{passwordChecks.length ? '✓' : '✗'}</span>
                  <span>At least 8 characters</span>
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    passwordChecks.upper ? 'text-emerald-400' : ''
                  }`}
                >
                  <span>{passwordChecks.upper ? '✓' : '✗'}</span>
                  <span>Uppercase letter</span>
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    passwordChecks.lower ? 'text-emerald-400' : ''
                  }`}
                >
                  <span>{passwordChecks.lower ? '✓' : '✗'}</span>
                  <span>Lowercase letter</span>
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    passwordChecks.number ? 'text-emerald-400' : ''
                  }`}
                >
                  <span>{passwordChecks.number ? '✓' : '✗'}</span>
                  <span>Number</span>
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    passwordChecks.special ? 'text-emerald-400' : ''
                  }`}
                >
                  <span>{passwordChecks.special ? '✓' : '✗'}</span>
                  <span>Special character</span>
                </li>
                <li
                  className={`flex items-center gap-1 ${
                    passwordChecks.noSpaces ? 'text-emerald-400' : ''
                  }`}
                >
                  <span>{passwordChecks.noSpaces ? '✓' : '✗'}</span>
                  <span>No spaces</span>
                </li>
              </ul>
            </div>
          )}

          <div className="flex justify-end -mt-2">
            <button
              type="button"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-2"
              onClick={() => navigate('/reset-password')}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {state === 'signup' ? 'Sign Up' : 'Login'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce-x"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              {state === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setState(state === 'signup' ? 'login' : 'signup')}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium"
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
