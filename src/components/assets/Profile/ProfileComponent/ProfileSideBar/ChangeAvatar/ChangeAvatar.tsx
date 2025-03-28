import { Avatar } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteAvatarReq,
  fetchProfileDataReq,
  selectUserProfile,
} from '../../../../../../redux/slices/authSlice';
import { AppDispatch } from '../../../../../../redux/store';

export const ChangeAvatar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const userData = useSelector(selectUserProfile);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const dispatch: AppDispatch = useDispatch();
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
    try {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        dispatch(deleteAvatarReq(formData));

        dispatch(fetchProfileDataReq());
        setPreview(null);
        setFile(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    setFile(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      if (userData?._id) {
        const formData = new FormData();
        formData.append('userId', userData._id);
        dispatch(deleteAvatarReq(formData));
      }

      dispatch(fetchProfileDataReq());
    } catch (error) {
      console.error('Error:', error);
    }
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

        <div className="absolute inset-0 flex justify-center rounded-full opacity-0 group-hover:opacity-100 delay-50 transition-opacity duration-200 ease-linear">
          <div className="bg-[#fafafa] bg-opacity-90 rounded-full flex items-center justify-center ">
            <span className="text-[#212121] text-xs font-medium">
              Change Avatar
            </span>
          </div>
        </div>
      </button>

      <button className="z-30 " onClick={handleDeleteAvatar}>
        <X
          size={18}
          onClick={handleRemovePreview}
          className="absolute top-6 left-[60px] bg-[#e4e4e4] text-black rounded-md p-[2px] cursor-pointer"
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
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className=""
          >
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-[45px] h-[45px] object-cover rounded-full border border-[#212121]"
            />
            <X
              size={18}
              onClick={handleRemovePreview}
              className="z-30 absolute top-[-4px] left-[50px] bg-[#e4e4e4] text-black rounded-md p-[2px] cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {preview && (
        <>
          <button
            onClick={handleUpload}
            className="ml-5 bg-blue-50 py-1 px-4 text-[#212121] border-2 border-gray-500/50 hover:border-[#212121] duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] delay-100  rounded-md transition-all 
            "
          >
            Change
          </button>
        </>
      )}
    </div>
  );
};
