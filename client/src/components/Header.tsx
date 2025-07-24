import type { FC } from 'react';
import { assets } from '../assets/assets';

const Header: FC = () => {
  return (
    <div>
      <img src={assets.header_img} alt="header" className="w-36 h-36 rounded-full mb-6" />
      <h1>
        Hey Developer <img src={assets.hand_wave} alt="hand wave" className="w-8 aspect-square" />
      </h1>
    </div>
  );
};
export default Header;
