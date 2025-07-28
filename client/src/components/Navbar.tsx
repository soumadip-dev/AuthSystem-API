import type { FC } from 'react';
import { assets } from '../assets/assets';
const Navbar: FC = () => {
  return (
    <div>
      <img src={assets.logo} alt="logo" className="w-28 sm:w-32 " />
      <button>Login</button>
    </div>
  );
};
export default Navbar;
