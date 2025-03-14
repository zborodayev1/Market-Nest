import { Avatar } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  deleteAvatar,
  fetchProfileData,
  selectUserProfile,
  uploadAvatar,
} from '../../../../../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../../../../../redux/store';

export const ChangeAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const userData = useSelector(selectUserProfile);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const error = useSelector((state: RootState) => state.auth.error);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      const resultAction = await dispatch(uploadAvatar(formData));
      if (uploadAvatar.fulfilled.match(resultAction)) {
        dispatch(fetchProfileData());
        setPreview(null);
        setFile(null);
      }
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    setFile(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };
  let resultAction: unknown;
  const handleDeleteAvatar = async () => {
    if (userData?._id) {
      const formData = new FormData();
      formData.append('userId', userData._id);
      resultAction = await dispatch(deleteAvatar(formData));
    }
    if (deleteAvatar.fulfilled.match(resultAction)) {
      dispatch(fetchProfileData());
      toast('Successfully created!', {
        type: 'success',
      });
    }

    toast(error, {
      type: 'error',
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => inputFileRef.current?.click()}
        className="relative group items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{
            filter: isHovered ? 'blur(2px)' : 'blur(0px)',
            transition: { duration: 0.5 },
          }}
          className="rounded-full"
        >
          <Avatar style={{ width: 45, height: 45 }} src={userData?.avatarUrl} />
        </motion.div>

        <div className="absolute inset-0 flex justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-linear">
          <div className="bg-[#fafafa] bg-opacity-90 rounded-full flex items-center justify-center ">
            <span className="text-[#212121] text-xs font-medium">
              Change Avatar
            </span>
          </div>
        </div>
      </button>

      <button className="z-30" onClick={handleDeleteAvatar}>
        <X
          size={18}
          onClick={handleRemovePreview}
          className="absolute top-6 left-[60px] bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors"
        />
      </button>

      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-[50px] h-[50px] object-cover rounded-full border border-[#212121]"
            />
            <X
              size={20}
              onClick={handleRemovePreview}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {preview && (
        <>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            className="px-3 py-1 bg-blue-50 h-[30px] text-[#212121] border border-[#212121] rounded-md"
          >
            Change
          </motion.button>
        </>
      )}
    </div>
  );
};
