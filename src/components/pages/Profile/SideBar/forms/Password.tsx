import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  RootState,
  selectUserProfile,
  updateProfilePassword,
} from "../../../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, RectangleEllipsis } from "lucide-react";
import { useState } from "react";

interface Formdata {
  password?: string;
  newPassword?: string;
}
interface Props {
  onSuccess: () => void;
}
export const Password = (props: Props) => {
  const userData = useSelector(selectUserProfile);
  const [isHovered, setIsHovered] = useState(false);
  const error = useSelector((state: RootState) => state.auth.error);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { onSuccess } = props;
  const dispatch = useDispatch();
  const { reset, register, handleSubmit } = useForm<Formdata>({
    mode: "onSubmit",
  });

  const onSubmit = async (values: Formdata) => {
    try {
      setIsSubmitting(true);

      const payload = {
        oldPassword: values.password || "",
        password: values.newPassword || "",
      };

      const resultAction = await dispatch(updateProfilePassword(payload));

      if (updateProfilePassword.fulfilled.match(resultAction)) {
        reset({ ...userData, ...values });
        onSuccess();
      } else {
        console.error("Ошибка:", resultAction.payload || "Неизвестная ошибка");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const inputClasses =
    "w-full px-4 py-2 bg-[#16151A] dark:bg-gray-800 border border-[#7e2dff] dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e2dff] dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 ";
  const labelClasses =
    "flex items-center gap-2 text-sm font-medium text-white dark:text-gray-300 mb-1";

  return (
    <AnimatePresence>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-md mx-auto p-6 bg-[#16151A] border-[2px] border-[#7e2dff] dark:bg-gray-900 rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div className="">
            <label className={labelClasses} htmlFor="password">
              <RectangleEllipsis size={23} />
              <h1 className="mt-[2px] ml-1">Old Password</h1>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                spellCheck="false"
                placeholder="12345678Test"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={inputClasses}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="">
            <label className={labelClasses} htmlFor="password">
              <RectangleEllipsis size={23} />
              <h1 className="mt-[2px] ml-1">New Password</h1>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                spellCheck="false"
                placeholder="12345678Test"
                id="password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={inputClasses}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          initial={{ borderRadius: 5 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02, borderRadius: 7 }}
          whileTap={{ scale: 0.99 }}
          className={` w-[300px] p-2 flex justify-center items-center text-[#7e2dff] border border-[#7e2dff] hover:-translate-y-1 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#7e2dff] hover:to-[#2124a8] hover:border-transparent group `}
        >
          <motion.span
            initial={{ textShadow: "none" }}
            animate={{
              textShadow: isHovered
                ? "2px 2px 6px #fff, -2px -2px 6px #fff"
                : "",
              transition: { duration: 0.4 },
            }}
            exit={{ textShadow: "none" }}
            className="  text-[#7e2dff]  duration-300 transition-colors ease-in-out group-hover:text-white  "
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </motion.span>
        </motion.button>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mt-2"
          >
            {error}
          </motion.p>
        )}
      </motion.form>
    </AnimatePresence>
  );
};
