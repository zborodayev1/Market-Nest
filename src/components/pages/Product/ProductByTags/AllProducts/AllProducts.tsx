import { useNavigate } from 'react-router-dom';

export const AllProducts = () => {
  const nav = useNavigate();

  const availableTags = [
    'Clothes',
    'Electronics',
    'House & Garden',
    'Construction and repair',
    'Sport',
    "Children's products",
    'Decorations and luxury',
  ];

  const handleSelectTag = (tag: any) => {
    nav(`/products/${tag}`);
  };
  return (
    <div className="mt-4 ">
      <div className="flex justify-center font-bold text-2xl">Products</div>
      <div className="flex justify-center mt-4 relative overflow-hidden">
        <div className="flex gap-4 text-xl">
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
    </div>
  );
};
