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
      <div>
        <h2>{state === 'signup' ? 'Create Account' : 'Login'}</h2>
        <p>{state === 'signup' ? 'Create Your Account' : 'Login to your account'}</p>
        <form>
          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.person_icon} alt="person" />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="bg-transparent outline-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
