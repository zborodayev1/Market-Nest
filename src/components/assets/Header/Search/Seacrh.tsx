import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import {
  fetchProducts,
  getProductsBySearch,
} from '../../../../redux/slices/productSlice';
import { AppDispatch } from '../../../../redux/store';

export const Seacrh = () => {
  const dispatch: AppDispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const previousSearchItem = useRef<string | null>(null);
  const [debouncedSearch] = useDebounce(searchItem, 1000);
  const isActive = hovered || focused;
  useEffect(() => {
    const trimmedSearchItem = debouncedSearch.trim();

    if (previousSearchItem.current === trimmedSearchItem) {
      return;
    }

    previousSearchItem.current = trimmedSearchItem;

    if (trimmedSearchItem === '') {
      dispatch(fetchProducts({ limit: 20, page: 1 }));
    } else {
      dispatch(getProductsBySearch(trimmedSearchItem));
    }
  }, [debouncedSearch, dispatch]);

  return (
    <div className="absolute transform flex justify-center items-center z-10">
      <div className="flex justify-center items-center p-2 px-3 ml-5">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          tabIndex={0}
          className={`relative bg-[#fff] border-2  ${focused ? 'border-[#3C8737]' : 'border-[#D1D5DB]'} rounded-[20px] transition-all group duration-300 overflow-hidden`}
        >
          <input
            type="text"
            onChange={(e) => setSearchItem(e.target.value)}
            value={searchItem}
            placeholder="Find your next favorite item..."
            className="w-[320px] px-5 py-3 rounded-full focus:outline-none"
            maxLength={30}
          />
          <motion.div
            initial={false}
            animate={{
              width: isActive ? 48 : 40,
              height: isActive ? 48 : 40,
              top: isActive ? 0 : 4,
              right: isActive ? 0 : 4,
              borderRadius: isActive ? 0 : '50%',
              backgroundColor: isActive ? '#3C8737' : '#E5E7EB',
            }}
            transition={{
              width: { duration: 0.1, delay: 0.05 },
              height: { duration: 0.1, delay: 0.05 },
              top: { duration: 0.1, delay: 0.05 },
              right: { duration: 0.1, delay: 0.05 },
              borderRadius: { duration: 0.1, delay: 0.05 },
              backgroundColor: { duration: 0.1, delay: 0.1 },
            }}
            className="absolute"
          />

          <motion.div
            initial={{ color: '#000' }}
            animate={{ color: isActive ? '#fff' : '#000' }}
            transition={{ duration: 0.1, delay: 0.1 }}
            className="absolute top-3 right-3"
          >
            <Search />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
