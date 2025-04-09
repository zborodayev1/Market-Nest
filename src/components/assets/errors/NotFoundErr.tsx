import { House } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const NotFoundErr = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
        <meta
          name="description"
          content="Welcome to the favorite of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, favorite"
        />
      </Helmet>
      <div className=" bg-[#FFFFFF]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-5 text-2xl text-black font-bold">
            <div className="">
              <h1 className="cursor-default flex justify-center ">
                The page you are looking for does not exist !
              </h1>
              <div className="flex justify-center mt-3">
                <Link to="/" className="w-[40px] h-[40px]">
                  <House width={35} height={35} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};
