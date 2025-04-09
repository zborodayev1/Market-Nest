import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Heart, IdCard, PackagePlus, ShoppingCart } from 'lucide-react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectIsAuth,
  selectUserProfile,
} from '../../../../redux/slices/authSlice';
import { NotiHeaderDropDown } from '../../Notification/NotiHeaderDropDown';
import { ProdileHeader } from '../../Profile/ProfileHeader/ProfileHeader';
import { SideBar } from '../../Profile/SidaBar/SideBar';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useWebSocket } from '../../hooks/useWebSocket';

interface Props {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (state: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const HeaderForm: React.FC<Props> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef,
}) => {
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserProfile);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const { unreadCount } = useWebSocket({ userId: userData?._id });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const headerButtonStyles =
    'mx-2 flex gap-2 items-center hover:bg-gray-200 p-2 px-5 rounded-full duration-200 ease-in-out group mt-1 ';

  useClickOutside(
    [notificationRef, buttonRef],
    () => setIsNotiOpen(false),
    isNotiOpen
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
      className="absolute right-3 flex items-center"
    >
      {isAuth ? (
        <div>
          <div className="flex items-center">
            <div className="relative">
              <button
                ref={buttonRef}
                className="relative z-10 mx-2 flex items-center hover:bg-[#E5E7EB] p-3 cursor-pointer rounded-full duration-200 ease-in-out "
                onClick={() => setIsNotiOpen(!isNotiOpen)}
              >
                <Bell
                  style={{ strokeWidth: 2 }}
                  className="w-8 h-8 text-[#212121]"
                />
                {unreadCount != null && unreadCount > 0 && (
                  <span className="absolute -top-[2px] -right-[2px] bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotiHeaderDropDown
                isNotiOpen={isNotiOpen}
                notificationRef={notificationRef}
                onSuccess={() => setIsNotiOpen(!isNotiOpen)}
                buttonRef={buttonRef}
              />
            </div>

            <Link className={headerButtonStyles} to="/create-product">
              <h1 className="text-base  font-bold text-[#212121]">Create</h1>
              <PackagePlus
                style={{ strokeWidth: 1.8 }}
                className="w-9 h-9 text-[#212121]"
              />
            </Link>

            <Link className={headerButtonStyles} to="/bag">
              <h1 className="text-base font-bold text-[#212121]">Bag</h1>
              <ShoppingCart
                style={{ strokeWidth: 2 }}
                className="w-8 h-9 text-[#212121] stroke-1 "
              />
            </Link>
            <Link className={headerButtonStyles} to="/saved-items">
              <h1 className="text-base font-bold text-[#212121]">Saved</h1>
              <Heart
                className="w-7 h-9 text-[#212121]"
                style={{ strokeWidth: 2 }}
              />
            </Link>
            <div className="ml-3">
              <ProdileHeader
                onSuccess={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Link className={headerButtonStyles} to="/bag">
            <h1 className="text-base font-bold text-[#212121]">Bag</h1>
            <ShoppingCart
              style={{ strokeWidth: 2 }}
              className="w-8 h-9 text-[#212121] "
            />
          </Link>
          <Link className={headerButtonStyles} to="/favorites">
            <h1 className="text-base font-bold text-[#212121]">Favorite</h1>
            <Heart
              className="w-7 h-9 text-[#212121]"
              style={{ strokeWidth: 2 }}
            />
          </Link>
          <Link to="/signIn" className={headerButtonStyles}>
            <h1 className="text-base font-bold text-[#212121]">Sign in</h1>
            <IdCard
              style={{ strokeWidth: 1.8 }}
              className="w-[44px] h-9 text-[#212121]"
            />
          </Link>
        </div>
      )}

      <div ref={dropdownRef} className="fixed right-0 top-0">
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ x: 250, opacity: 0 }}
              animate={{
                x: isDropdownOpen ? 0 : 250,

                opacity: isDropdownOpen ? 1 : 0,
              }}
              exit={{
                x: 250,

                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <SideBar
                setIsDropdownOpen={setIsDropdownOpen}
                isDropdownOpen={isDropdownOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
