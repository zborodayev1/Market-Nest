import { Avatar } from '@mui/material';
import { useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfileDataReq,
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
      dispatch(fetchProfileDataReq());
    };

    loadProfileData();
  }, [dispatch]);

  const handleCLick = () => {
    onSuccess();
  };

  return (
    <div className="group pr-3">
      <button
        onClick={handleCLick}
        className="flex gap-2 items-center right-0 rounded-full duration-300 ease-in-out group"
      >
        <div
          className="shadow-lg rounded-full  relative flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          {userData?.avatarUrl ? (
            <div className="rounded-full hover:shadow-xl transition-shadow duration-300 ease-in-out delay-50">
              <Avatar src={userData.avatarUrl} />
            </div>
          ) : (
            <div>
              <CgProfile
                className="rounded-full  duration-300 ease-in-out hover:shadow-xl "
                style={{ width: 35, height: 40 }}
              />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};
