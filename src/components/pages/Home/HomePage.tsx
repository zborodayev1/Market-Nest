import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const nav = useNavigate();
  const availableTags = [
    'Clothes',
    'Electronics',
    'House & Garden',
    'Construction and repair',
    'All',
    'Sport',
    "Children's products",
    'Decorations and luxury',
  ];

  const handleSelectTag = (tag: any) => {
    nav(`/products/${tag}`);
  };

  return (
    <>
      <Helmet>
        <title>Market Nest</title>
        <meta name="description" content="Welcome to Market Nest!" />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-[#FFFFFF]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          className="text-xl"
        >
          <div className="flex justify-center mt-7 relative overflow-hidden">
            <div
              className="flex gap-4 whitespace-nowrap px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                display: 'flex',
                overflowX: 'auto',
              }}
            >
              {availableTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectTag(tag)}
                  className={`px-5 py-1 rounded-lg transition-colors ease-in-out duration-300 bg-gray-200 text-gray-800 hover:bg-[#1f5e1c] hover:text-white`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
