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
import { ProdileHeader } from '../../Profile/ProfileComponent/ProfileHeaderComponents/ProfileHeader';
import { SideBar } from '../../Profile/ProfileComponent/ProfileSideBar/SidaBar/SideBar';
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
  const headerButtonStyles = 'mx-4 flex items-center ';
  const [hovered, setHovered] = useState<{
    noti: boolean;
    create: boolean;
    bag: boolean;
    fav: boolean;
  }>({
    noti: false,
    create: false,
    bag: false,
    fav: false,
  });

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
                className="relative flex gap-2 items-center mx-4 rounded-full cursor-pointer group"
                onClick={() => setIsNotiOpen(!isNotiOpen)}
                onMouseEnter={() =>
                  setHovered({
                    noti: true,
                    create: false,
                    bag: false,
                    fav: false,
                  })
                }
                onMouseLeave={() =>
                  setHovered({
                    noti: false,
                    create: false,
                    bag: false,
                    fav: false,
                  })
                }
              >
                <motion.div
                  className="absolute inset-0 bg-gray-200 rounded-full  -z-1"
                  initial={{ scale: 0.1 }}
                  animate={{
                    scale: hovered.noti ? 1.8 : 0,
                  }}
                  transition={{
                    duration: hovered.noti ? 0.1 : 0.2,
                    delay: hovered.noti ? 0 : 0.1,
                    ease: 'easeInOut',
                  }}
                />

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
            <Link
              className={`${headerButtonStyles} relative w-9 h-9`}
              to="/create-product"
              onMouseEnter={() =>
                setHovered({
                  noti: false,
                  create: true,
                  bag: false,
                  fav: false,
                })
              }
              onMouseLeave={() =>
                setHovered({
                  noti: false,
                  create: false,
                  bag: false,
                  fav: false,
                })
              }
            >
              <motion.div
                className="absolute inset-0 bg-gray-200 rounded-full -z-1"
                initial={{ scale: 0.1 }}
                animate={{
                  scale: hovered.create ? 1.6 : 0.1,
                }}
                transition={{
                  duration: hovered.create ? 0.1 : 0.2,
                  delay: hovered.create ? 0 : 0.1,
                  ease: 'easeInOut',
                }}
              />
              <PackagePlus
                style={{ strokeWidth: 1.8 }}
                className="w-9 h-9 text-[#212121]"
              />
            </Link>

            <Link
              className={`${headerButtonStyles} relative w-8 h-8`}
              to="/bag"
              onMouseEnter={() =>
                setHovered({
                  noti: false,
                  create: false,
                  bag: true,
                  fav: false,
                })
              }
              onMouseLeave={() =>
                setHovered({
                  noti: false,
                  create: false,
                  bag: false,
                  fav: false,
                })
              }
            >
              <motion.div
                className="absolute inset-0 bg-gray-200 rounded-full -z-1"
                initial={{ scale: 0.1 }}
                animate={{
                  scale: hovered.bag ? 1.6 : 0.1,
                }}
                transition={{
                  duration: hovered.bag ? 0.1 : 0.2,
                  delay: hovered.bag ? 0 : 0.1,
                  ease: 'easeInOut',
                }}
              />
              <ShoppingCart
                style={{ strokeWidth: 2 }}
                className="w-8 h-8 text-[#212121] "
              />
            </Link>
            <Link
              className={`${headerButtonStyles} relative w-8 h-8`}
              to="/favorites"
              onMouseEnter={() =>
                setHovered({
                  noti: false,
                  create: false,
                  bag: false,
                  fav: true,
                })
              }
              onMouseLeave={() =>
                setHovered({
                  noti: false,
                  create: false,
                  bag: false,
                  fav: false,
                })
              }
            >
              <motion.div
                className="absolute inset-0 bg-gray-200 rounded-full -z-1"
                initial={{ scale: 0.1 }}
                animate={{
                  scale: hovered.fav ? 1.6 : 0.1,
                }}
                transition={{
                  duration: hovered.fav ? 0.1 : 0.2,
                  delay: hovered.fav ? 0 : 0.1,
                  ease: 'easeInOut',
                }}
              />
              <Heart
                className="w-8 h-8 text-[#212121]"
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
            <ShoppingCart
              style={{ strokeWidth: 1.8 }}
              className="w-8 h-8 text-[#212121] "
            />
          </Link>
          <Link className={headerButtonStyles} to="/favorites">
            <Heart className="w-8 h-8 text-[#212121]" />
          </Link>
          <Link to="/signIn" className={headerButtonStyles}>
            <IdCard
              style={{ strokeWidth: 1.8 }}
              className="w-[44px] h-9 text-[#212121] transition-colors duration-300"
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
                y: -3,
                opacity: isDropdownOpen ? 1 : 0,
              }}
              exit={{
                x: 250,
                y: -3,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                opacity: { duration: 0.2, delay: 0.05 },
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
