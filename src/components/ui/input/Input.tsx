import { motion } from 'framer-motion';
import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface EmailInputProps {
  register?: UseFormRegister<any>;
  isError?: boolean;
  icon?: React.ReactNode;
  type?: 'email' | 'password' | 'text';
  placeholder: string;
  inputStyle?: string;
  sircleWidth: number;
  sircleHeight: number;
  sircleWidthActive: number;
  sircleHeightActive: number;
  sircleRight: number;
  sircleTop: number;
  iconTop: number;
  iconRight: number;
  registerName?: string;
  registerReq?: string;
  registerPatternMessage?: string;
  registerMinLenghtValue?: number;
  isPattern?: boolean;
  isMinLength?: boolean;
  isDef?: boolean;
  isAddress?: boolean;
  registerMinLenghtMessage?: string;
  iconButtonOnCLick?: () => void;
}

const Input = ({
  register,
  isError,
  icon,
  type,
  placeholder,
  inputStyle,
  sircleWidth,
  sircleHeight,
  sircleWidthActive,
  sircleHeightActive,
  sircleRight,
  sircleTop,
  iconTop,
  iconRight,
  registerName,
  registerReq,
  registerPatternMessage,
  registerMinLenghtValue,
  isPattern,
  isMinLength,
  isDef,
  isAddress,
  registerMinLenghtMessage,
  iconButtonOnCLick,
}: EmailInputProps) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isActive = focused || hovered;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        borderRadius: '20px 40px 40px 20px',
      }}
      className={`relative bg-[#fff] border-2  ${
        isError
          ? 'border-red-500'
          : focused
            ? 'border-[#3C8737]'
            : 'border-[#D1D5DB]'
      }  transition-all group duration-300 overflow-hidden`}
    >
      {isPattern && registerName && register && (
        <input
          className={`${inputStyle ? inputStyle : ''} bg-[#fafafa] focus:outline-none `}
          type={type}
          placeholder={placeholder}
          {...register(registerName, {
            required: registerReq,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: registerPatternMessage || 'Invalid email address',
            },
          })}
        />
      )}
      {isMinLength && registerName && register && (
        <input
          className={`${inputStyle ? inputStyle : ''} bg-[#fafafa] focus:outline-none `}
          type={type}
          placeholder={placeholder}
          {...register(registerName, {
            required: registerReq,
            minLength: {
              value: registerMinLenghtValue || 8,
              message:
                registerMinLenghtMessage || 'Must be at least 8 characters',
            },
          })}
        />
      )}
      {isDef && registerName && register && (
        <input
          className={`${inputStyle ? inputStyle : ''} bg-[#fafafa] focus:outline-none `}
          type={type}
          placeholder={placeholder}
          {...register(registerName, {
            required: registerReq,
          })}
        />
      )}
      {isAddress && (
        <input
          className={`${inputStyle ? inputStyle : ''} bg-[#fafafa] focus:outline-none `}
          readOnly
          placeholder={placeholder}
        />
      )}

      <motion.div
        initial={false}
        className="absolute"
        animate={{
          width: isError
            ? sircleWidth
            : isActive
              ? sircleWidthActive
              : sircleWidth,
          height: isError
            ? sircleHeight
            : isActive
              ? sircleHeightActive
              : sircleHeight,
          top: isError ? sircleTop : isActive ? 0 : sircleTop,
          right: isError ? sircleRight : isActive ? 0 : sircleRight,
          borderRadius: isError ? '50%' : isActive ? 0 : '50%',
          border: isError ? '2px solid #EF4444' : 'none',
          backgroundColor: isError
            ? '#E5E7EB'
            : isActive
              ? '#3C8737'
              : '#E5E7EB',
        }}
        transition={{
          width: { duration: 0.1, delay: 0.05 },
          height: { duration: 0.1, delay: 0.05 },
          top: { duration: 0.1, delay: 0.05 },
          right: { duration: 0.1, delay: 0.05 },
          borderRadius: { duration: 0.2, delay: 0.05 },
          backgroundColor: { duration: 0.1, delay: 0.1 },
        }}
      />

      <motion.button
        initial={{ color: '#000' }}
        animate={{
          color: isError ? '#000' : isActive ? '#fff' : '#000',
        }}
        transition={{ duration: 0.1, delay: 0.1 }}
        style={{
          top: iconTop,
          right: iconRight,
        }}
        onClick={iconButtonOnCLick}
        className="absolute"
      >
        {icon && icon}
      </motion.button>
    </div>
  );
};

export default Input;
