import { Avatar } from '@mui/material';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfileData,
  selectUserProfile,
} from '../../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../../redux/store';

interface Props {
  onSuccess: () => void;
}

export const ProdileHeader = (props: Props) => {
  const { onSuccess } = props;
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector(selectUserProfile);

  useEffect(() => {
    const loadProfileData = () => {
      dispatch(fetchProfileData());
    };

    loadProfileData();
  }, [dispatch]);

  const handleCLick = () => {
    onSuccess();
  };

  return (
    <div className="group px-3">
      <button
        onClick={handleCLick}
        className="mx-2 flex gap-2 items-center   right-0 rounded-full duration-300 ease-in-out group mt-1"
      >
        <div
          className="shadow-lg rounded-full  relative flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          {userData?.avatarUrl ? (
            <motion.div className="rounded-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <Avatar src={userData.avatarUrl} />
            </motion.div>
          ) : (
            <div>
              <CgProfile
                className="rounded-full hover:shadow-xl transition-shadow duration-300 ease-in-out"
                style={{ width: 35, height: 40 }}
              />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
