import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotificationCountReq } from '../../../redux/slices/notificationSlice';
import { AppDispatch } from '../../../redux/store';
import { useClickOutside } from '../hooks/useClickOutside';
import { Seacrh } from './Search/Seacrh';
import { HeaderForm } from './forms/HeaderForm';

interface Props {
  toastRef?: React.RefObject<HTMLDivElement>;
}

export const Header = (props: Props) => {
  const { toastRef } = props;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  useClickOutside([dropdownRef, toastRef], () => setIsDropdownOpen(false));
  useEffect(() => {
    dispatch(fetchNotificationCountReq());
  }, [dispatch]);
  return (
    <div>
      <div className="relative items-center flex bg-[#F5F5F5] z-30 w-full h-[100px]">
        <Seacrh />

        <div className="absolute inset-x-0 flex justify-center items-center">
          <Link to="/">
            <div className="flex justify-center group">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                }}
                className="text-3xl font-bold text-[#212121]"
              >
                Market Nest
              </motion.span>
            </div>
          </Link>
        </div>
        <HeaderForm
          dropdownRef={dropdownRef}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      </div>

      <div className="h-[1px] bg-[#E5E7EB]" />
    </div>
  );
};
