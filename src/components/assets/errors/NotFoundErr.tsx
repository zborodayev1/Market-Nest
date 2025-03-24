import { House } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const NotFoundErr = () => {
  return (
    <div className="h-screen bg-[#FFFFFF]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-center p-5 text-2xl text-black font-bold">
          <div>
            <h1>
              The page you are looking for does not exist or is under
              construction!
            </h1>
            <Link to="/" className="flex justify-center mt-3">
              <House width={35} height={35} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
