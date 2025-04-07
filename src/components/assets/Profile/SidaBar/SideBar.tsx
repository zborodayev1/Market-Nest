import { motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutReq } from '../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../redux/store';
import { ChangeAvatar } from './ChangeAvatar/ChangeAvatar';
import { SideBarEmailForm } from './Forms/Email/SideBarEmailForm';
import { SideBarPemdingProductsForm } from './Forms/ForAdmin/SideBarPemdingProductsForm';
import { SideBarPasswordForm } from './Forms/Password/SideBarPasswordForm';
import { SideBarPhoneForm } from './Forms/Phone/SideBarPhoneForm';
import { SideBarUserDataForm } from './Forms/UserData/SideBarUserDataForm';

interface Props {
  setIsDropdownOpen: (value: boolean) => void;
  isDropdownOpen: boolean;
}

export const SideBar = (props: Props) => {
  const [logOutState, setLogOutState] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { setIsDropdownOpen, isDropdownOpen } = props;

  const [changeProfileState, setChangeProfileState] = useState<{
    ChangeName: boolean;
    ChangePassword: boolean;
    ChangeEmail: boolean;
    ChangePhone: boolean;
  }>({
    ChangeName: false,
    ChangePassword: false,
    ChangeEmail: false,
    ChangePhone: false,
  });

  useEffect(() => {
    if (logOutState === true) {
      dispatch(logoutReq());
      setLogOutState(false);
    }
  }, [logOutState, dispatch]);

  const onClickLogout = () => {
    setLogOutState(true);
    dispatch(logoutReq());
    setIsDropdownOpen(false);
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div>
      {isDropdownOpen && (
        <div className="fixed top-0 right-0 bg-[#fff] border-l-[2px] border-slate-300 shadow-md min-w-[420px] h-screen p-3 overflow-hidden">
          <div className="fixed right-8 top-8">
            <button
              className="hover:bg-gray-200 duration-300 flex justify-center items-center w-[36px] h-[36px] cursor-pointer  rounded-lg"
              onClick={() => setIsDropdownOpen(false)}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
          <div className="mt-[16px] mb-2.5">
            <ChangeAvatar />
          </div>

          <motion.div variants={contentVariants}>
            <div className="flex flex-col gap-2 mt-2.5">
              <SideBarUserDataForm
                changeProfileState={changeProfileState}
                setChangeProfileState={setChangeProfileState}
              />
              <SideBarEmailForm
                changeProfileState={changeProfileState}
                setChangeProfileState={setChangeProfileState}
              />
              <SideBarPhoneForm
                changeProfileState={changeProfileState}
                setChangeProfileState={setChangeProfileState}
              />
              <SideBarPasswordForm
                changeProfileState={changeProfileState}
                setChangeProfileState={setChangeProfileState}
              />

              <hr className="bg-[#212121]" />
              <SideBarPemdingProductsForm
                onSuccess={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              <motion.div variants={contentVariants} className="text-sm mt-1">
                <motion.button
                  className="w-full bg-[#fcdede] hover:bg-[#f5b3b3] transition-colors hover:bg ease-in-out duration-300  text-red-600 font-medium px-4 py-3 rounded-lg flex items-center justify-center gap-2 delay-50 "
                  onClick={onClickLogout}
                >
                  <LogOut />
                  Sign out
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
