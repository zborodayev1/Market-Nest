import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../../redux/slices/productSlice';
import { AppDispatch } from '../../../redux/store';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  limitError: boolean;
  setLimitError: React.Dispatch<React.SetStateAction<boolean>>;
  PGState: {
    limit: number;
    page: number;
  };
  setPGState: React.Dispatch<
    React.SetStateAction<{ limit: number; page: number }>
  >;

  totalPages: number;

  focusLimit: boolean;
  setFocusLimit: React.Dispatch<React.SetStateAction<boolean>>;
  focusPage: boolean;
  setFocusPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageSettingsForm = (props: Props) => {
  const {
    limitError,
    setLimitError,
    PGState,
    setPGState,
    totalPages,
    focusLimit,
    focusPage,
    setFocusLimit,
    setFocusPage,
  } = props;

  const [buttonPage, setButtonPage] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [PGStateChange, setPGStateChange] = useState<{
    limit: number;
    page: number;
  }>({
    limit: 10,
    page: 1,
  });

  const changeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      setLimitError(true);
    } else {
      setLimitError(false);
      setPGStateChange((prevState) => ({
        ...prevState,
        limit: Number(e.target.value),
      }));
    }
  };

  const changePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageValue = Number(e.target.value);

    setPGStateChange((prevState) => ({
      ...prevState,
      page: pageValue,
    }));
  };

  const onSubmit = () => {
    if (!loading) {
      setLoading(true);
      setButtonPage(true);

      if (PGStateChange.page > totalPages) {
        setPGState((prevState) => ({
          ...prevState,
          limit: PGStateChange.limit,
          page: totalPages,
        }));
      } else {
        setPGState((prevState) => ({
          ...prevState,
          limit: PGStateChange.limit,
          page: PGStateChange.page,
        }));
      }

      dispatch(
        fetchProducts({
          limit: PGState.limit,
          page: PGState.page,
        })
      );

      setTimeout(() => {
        setLoading(false);
        setButtonPage(false);
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-5 ml-5 mb-3 flex gap-2 h-10">
        <AnimatePresence>
          <div className="flex gap-7 items-center">
            <div className="flex items-center gap-2">
              <h1>products per page:</h1>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{
                  borderColor: limitError
                    ? '#dc2626'
                    : focusLimit
                      ? '#fff'
                      : '#d1d5db',
                  backgroundColor: limitError
                    ? 'rgba(239, 68, 68, 0.5)'
                    : focusLimit
                      ? '#3C8737'
                      : '#fafafa',
                  color: limitError
                    ? '#ffffff'
                    : focusLimit
                      ? '#fff'
                      : '#000000',
                  boxShadow: limitError
                    ? '0 0 0 4px rgba(239, 68, 68, 0.5)'
                    : focusLimit
                      ? '0 0 0 4px #3C8737'
                      : '0 0 0 4px rgba(0, 0, 0, 0.1)',
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.4 },
                }}
                onFocus={() => setFocusLimit(true)}
                onBlur={() => setFocusLimit(false)}
                tabIndex={0}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  appearance: 'none',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }}
                className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-1"
                type="text"
                onChange={changeLimit}
                defaultValue={PGState.limit}
              />
            </div>

            <div className="flex items-center gap-2">
              <h1>page:</h1>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{
                  borderColor: focusPage ? '#fff' : '#d1d5db',
                  backgroundColor: focusPage ? '#3C8737' : '#fafafa',
                  color: focusPage ? '#fff' : '#000000',
                  boxShadow: focusPage
                    ? '0 0 0 4px #3C8737'
                    : '0 0 0 4px rgba(0, 0, 0, 0.1)',
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.1 },
                }}
                onFocus={() => setFocusPage(true)}
                onBlur={() => setFocusPage(false)}
                tabIndex={0}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  appearance: 'none',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }}
                className="w-20 px-3 py-1 border rounded-md focus:outline-none focus:ring-1"
                type="text"
                onChange={changePage}
                defaultValue={PGState.page}
              />
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{
                  borderColor: buttonPage ? '#fff' : '#d1d5db',
                  backgroundColor: buttonPage ? '#3C8737' : '#fafafa',
                  color: buttonPage ? '#fff' : '#000000',
                  boxShadow: buttonPage
                    ? '0 0 0 4px #3C8737'
                    : '0 0 0 4px rgba(0, 0, 0, 0.1)',
                  opacity: 1,
                  width: loading ? 120 : 96,
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.1 },
                }}
                tabIndex={0}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  appearance: 'none',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-1"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? 'Submiting...' : 'Submit'}
              </motion.button>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};
