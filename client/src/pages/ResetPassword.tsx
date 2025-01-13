import { useRef, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState('');

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const value = e.currentTarget.value;
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    const pasteArr = paste.split('');

    pasteArr.forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
      }
    });
    // Focus last filled box
    const lastIndex = Math.min(pasteArr.length, inputRefs.current.length) - 1;
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
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

        <form className="space-y-6">
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
      {/* OTP input */}
      <div className="bg-slate-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl w-full sm:w-96 text-indigo-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text">
            Reset Password OTP
          </h2>
          <p className="text-sm text-indigo-300/80">Enter the 6-digit code sent to your email</p>
        </div>
        <form className="space-y-6">
          <div className="flex justify-between mb-4" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C]/80 text-white text-xl text-center rounded-xl focus:bg-[#333A5C] focus:ring-2 focus:ring-indigo-500 outline-none"
                  ref={el => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onInput={e => handleInput(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
      {/* Enter new password */}
      <div className="bg-slate-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl w-full sm:w-96 text-indigo-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text">
            New Password
          </h2>
          <p className="text-sm text-indigo-300/80">Enter your new password</p>
        </div>

        <form className="space-y-6">
          <div className="relative">
            <img
              src={assets.lock_icon}
              alt="password"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              required
              className="w-full pl-12 pr-4 py-3 bg-[#333A5C]/80 text-white rounded-xl focus:bg-[#333A5C] focus:ring-2 focus:ring-indigo-500 outline-none placeholder-indigo-300/70"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
