import {
  Bell,
  Heart,
  IdCard,
  PackagePlus,
  PackageSearch,
  ShoppingCart,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  selectIsAuth,
  selectUserProfile,
} from '../../../redux/slices/authSlice';
import { fetchNotificationCountReq } from '../../../redux/slices/notificationSlice';
import {
  fetchProducts,
  getProductsBySearch,
} from '../../../redux/slices/productSlice';
import { AppDispatch } from '../../../redux/store';
import { useClickOutside } from '../hooks/useClickOutside';
import { useWebSocket } from '../hooks/useWebSocket';
import { NotiHeaderDropDown } from '../Notification/NotiHeaderDropDown';
import { ProdileHeader } from '../Profile/ProfileComponent/ProfileHeaderComponents/ProfileHeader';
import { SideBar } from '../Profile/ProfileComponent/ProfileSideBar/SidaBar/SideBar';

interface Props {
  toastRef?: React.RefObject<HTMLDivElement>;
}

export const Header = (props: Props) => {
  const { toastRef } = props;
  const isAuth = useSelector(selectIsAuth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [searchItem, setSearchItem] = useState('');
  const previousSearchItem = useRef<string | null>(null);
  const [debouncedSearch] = useDebounce(searchItem, 1000);
  const userData = useSelector(selectUserProfile);
  const dispatch: AppDispatch = useDispatch();
  const headerButtonStyles =
    'mx-2 flex gap-2 items-center  hover:bg-[#E4E4E4] p-2 px-5 rounded-full duration-300 ease-in-out group mt-1 border-2 border-transparent hover:border-black delay-100 ';
  const { unreadCount } = useWebSocket({ userId: userData?._id });

  useClickOutside([dropdownRef, toastRef], () => setIsDropdownOpen(false));
  useClickOutside(
    [notificationRef, buttonRef],
    () => setIsNotiOpen(false),
    isNotiOpen
  );

  const sidebarVariants = {
    initial: {
      x: 250,
      opacity: 0,
    },
    animate: {
      x: isDropdownOpen ? 0 : 250,
      y: -3,
      opacity: isDropdownOpen ? 1 : 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: 0.05,
      },
    },
    exit: {
      x: 250,
      y: -3,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: 0.05,
      },
    },
  };

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

  useEffect(() => {
    dispatch(fetchNotificationCountReq());
  }, [dispatch]);
  return (
    <div>
      <div className="relative items-center flex bg-[#F5F5F5] z-30 w-full h-[100px]">
        <div className="absolute left-[120px] transform -translate-x-1/2 flex justify-center items-center z-10">
          <div className="flex justify-center items-center p-2 px-3 ml-[90px]">
            <div>
              <input
                type="text"
                onChange={(e) => setSearchItem(e.target.value)}
                value={searchItem}
                placeholder="Search"
                className="w-[240px] px-5 py-[10px] bg-[#fff] border-2 border-[#D1D5DB] hover:border-2 hover:border-black rounded-2xl focus:outline-none focus:border-2 focus:border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 "
              />
            </div>
            <button className="items-center absolute z-20 right-[25px]">
              <PackageSearch
                style={{ strokeWidth: 1.8 }}
                className="w-7 h-7 ml-2 text-[#353535]"
              />
            </button>
          </div>
        </div>

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
              <div className="flex">
                <div className="relative">
                  <button
                    ref={buttonRef}
                    className="relative z-10 mx-1 border-2 border-transparent hover:border-black  flex gap-2  items-center hover:bg-[#E4E4E4] p-3 rounded-full duration-300 ease-in-out delay-100 "
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
                  <h1 className="text-base  font-bold text-[#212121]">
                    Create
                  </h1>
                  <PackagePlus
                    style={{ strokeWidth: 1.8 }}
                    className="w-9 h-9 text-[#212121]"
                  />
                </Link>

                <Link className={headerButtonStyles} to="/bag">
                  <h1 className="text-base font-bold text-[#212121]">Bag</h1>
                  <ShoppingCart
                    style={{ strokeWidth: 2 }}
                    className="w-8 h-8 text-[#212121] stroke-1 "
                  />
                </Link>
                <Link className={headerButtonStyles} to="/favorites">
                  <h1 className="text-base font-bold text-[#212121]">
                    Favorite
                  </h1>
                  <Heart
                    className="w-7 h-9 text-[#212121]"
                    style={{ strokeWidth: 2 }}
                  />
                </Link>
                <div className="my-auto">
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
                  style={{ strokeWidth: 1.8 }}
                  className="w-8 h-8 text-[#212121] "
                />
              </Link>
              <Link className={headerButtonStyles} to="/favorites">
                <h1 className="text-base font-bold text-[#212121]">Favorite</h1>
                <Heart className="w-7 h-9 text-[#212121]" />
              </Link>
              <Link to="/signIn" className={headerButtonStyles}>
                <h1 className="text-base font-bold text-[#212121] transition-colors duration-300">
                  Sign in
                </h1>
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
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={sidebarVariants}
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
      </div>

      <div className="h-[1px] bg-[#E5E7EB]" />
    </div>
  );
};
