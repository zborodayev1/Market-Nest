import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const nav = useNavigate();

  const availableTags = [
    'All',
    'Clothes',
    'Electronics',
    'House & Garden',
    'Construction and repair',
    'Sport',
    "Children's products",
    'Decorations and luxury',
  ];

  const specialTags = [
    'New',
    'Popular',
    'Discount',
    'More offers',
    'Top Rated',
    'Limited Edition',
  ];

  const handleSelectTag = (tag: string) => {
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
        className="bg-[#FFFFFF] h-[1000px]"
      >
        <div className="bg-black text-white font-bold py-5">
          <h1 className="flex justify-center italic ">25% OFF ELECTRONICS</h1>
          <h1 className="flex justify-center italic">
            25% OFF CONSTRUCTION & REPAIR
          </h1>
          <h1 className="flex justify-center">Use code: MN2025</h1>
        </div>

        <div className="relative h-[500px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="Shop the latest trends"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#000]/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Spring Collection 2025
              </h2>
              <p className="text-xl mb-6">
                Discover the latest trends and styles
              </p>
              <div className="text-xl flex justify-center my-2">
                <div className="flex gap-4 px-4">
                  {specialTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectTag(tag)}
                      className="px-5 py-1 rounded-full cursor-pointer bg-gray-200 text-gray-800 hover:bg-[#1f5e1c] hover:text-white transition-colors ease-in-out duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xl flex justify-center">
                <div className="flex gap-4 px-4">
                  {availableTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectTag(tag)}
                      className="px-5 py-1 rounded-full cursor-pointer bg-gray-200 text-gray-800 hover:bg-[#1f5e1c] hover:text-white transition-colors ease-in-out duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
