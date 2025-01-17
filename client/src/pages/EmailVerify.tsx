import { useRef, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const EmailVerify: FC = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<HTMLInputElement[]>([]); // ✅ Proper typing

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    if (e.currentTarget.value) {
      inputRefs.current[index + 1]?.focus();
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
            Email Verification
          </h2>
          <p className="text-sm text-indigo-300/80">Enter the 6-digit OTP sent to your email</p>
        </div>

        <form className="space-y-6">
          <div className="flex justify-between mb-4">
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
                />
              ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
