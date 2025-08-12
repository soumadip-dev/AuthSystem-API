import type { FC } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <Header />
    </div>
  );
};
export default Home;
