import { RefObject, useEffect } from 'react';

type RefType = RefObject<HTMLElement>;

export const useClickOutside = (
  refs: (RefType | undefined)[], // Разрешаем undefined
  callback: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const validRefs = refs.filter((ref): ref is RefType => !!ref?.current);

      if (validRefs.some((ref) => ref.current?.contains(target))) {
        return;
      }

      callback();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, callback, enabled]);
};
