import type { FC } from 'react';
import { assets } from '../assets/assets';
const Navbar: FC = () => {
  return (
    <div>
      <img src={assets.logo} alt="logo" />
    </div>
  );
};
export default Navbar;

// git commit --date="2025-07-28T11:00:00" -m "fix import problem in main.tsx"
