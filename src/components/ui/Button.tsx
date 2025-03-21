import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  ripClassName?: string;
  duration?: number;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, ripClassName = '', className = '', duration = 1, ...props },
    ref
  ) => {
    const [ripples, setRipples] = useState<
      { x: number; y: number; id: number }[]
    >([]);
    const rippleId = performance.now();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      setRipples((prev) => [...prev, { x, y, id: rippleId }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 600);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`relative overflow-hidden  focus:outline-none ${className}`}
        {...props}
      >
        {children}
        {ripples.map(({ x, y, id }) => (
          <motion.span
            key={id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: duration, ease: 'linear' }}
            className={`absolute ${ripClassName ? ripClassName : 'bg-white'} rounded-full`}
            style={{
              width: 100,
              height: 100,
              top: y - 50,
              left: x - 50,
            }}
          />
        ))}
      </button>
    );
  }
);
