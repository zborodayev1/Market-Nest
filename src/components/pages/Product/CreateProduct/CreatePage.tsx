import { Coins, ImagePlus, Package, Tags, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProduct } from '../../../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../../../redux/store';

interface FormData {
  name: string;
  price: number;
  tags: string[];
  image: File | null;
}

export const CreatePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sport']);
  const error = useSelector((state: RootState) => state.products.error);
  const [message, setMessage] = useState<string>('');
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      name: 'testtest',
      price: 11110,
      tags: [],
      image: null,
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setValue('image', null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price.toString());
      formData.append('tags', JSON.stringify(selectedTags));

      if (values.image instanceof File) {
        formData.append('image', values.image);
      }

      await dispatch(createProduct(formData)).unwrap();

      toast('Successfully created!', {
        type: 'success',
        onClose: () => {
          navigate('/');
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message || 'An unknown error occurred';
      setMessage(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const availableTags = [
    'Clothes',
    'Electronics',
    'House & Garden',
    'Construction and repair',
    'Sport',
    "Children's products",
    'Decorations and luxury',
  ];

  return (
    <>
      <Helmet>
        <title>Create Product</title>
        <meta
          name="description"
          content="Welcome to the page Create product of Market Nest"
        />
        <meta
          name="keywords"
          content="market, shop, market nest, market nests, create, create product"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className="flex justify-center items-center mt-5"
      >
        <div className="h-[1000px]">
          <h1 className="flex justify-center mb-5 font-bold  text-2xl">
            Create Product
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="gap-2 bg-[#f5f5f5] p-5 px-6 rounded-2xl border-2 "
          >
            <div>
              <label className="flex items-center gap-2 text-xl font-bold text-black  mb-1">
                <Package size={24} />
                Product Name
              </label>
              <input
                {...register('name')}
                className="w-[430px] px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200"
                placeholder="Product name"
                spellCheck="false"
              />
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-2 text-xl font-bold text-black  mb-1">
                <Coins size={24} />
                Price
              </label>
              <input
                type="number"
                {...register('price')}
                className="w-[430px] px-4 py-2 bg-[#fff] border border-[#212121] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212121] focus:bg-[#e4e4e4] focus:border-transparent transition-all duration-200"
                placeholder="Price"
              />
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-2 text-xl font-bold text-black  mb-1">
                <Tags size={24} />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-w-[440px]">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/3 px-4 py-2 rounded-lg transition-colors ease-in-out duration-300 delay-50
                    ${
                      selectedTags.includes(tag)
                        ? 'bg-[#2B6128] text-white hover:bg-[#3C8737]'
                        : 'bg-gray-200 text-gray-800 hover:bg-[#1f5e1c'
                    } 
                    hover:bg-[#2B6128] hover:text-white`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex-col ">
              <label className="flex  items-center gap-2 text-xl font-bold text-black  mb-1">
                <ImagePlus size={24} />
                Image
              </label>
              <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <AnimatePresence>
                {!imagePreview && (
                  <motion.button
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-[430px] h-[200px] border-dashed border-2 border-[#212121] flex justify-center items-center hover:bg-[#e4e4e4] transition-colors ease-in-out duration-300 delay-50"
                  >
                    <ImagePlus size={50} />
                  </motion.button>
                )}
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 flex justify-center relative"
                  >
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-[350px] h-[200px] object-cover rounded-lg"
                    />
                    <X
                      size={40}
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute top-0 bg-red-500 right-0 text-white rounded-full p-2 hover:bg-red-600 transition-colors delay-50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-5 w-full p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128]  transition-all duration-300 ease-in-out delay-50`}
            >
              <span className="text-[#fff] font-bold">
                {isSubmitting ? 'Creating...' : 'Create'}
              </span>
            </button>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center mt-2"
              >
                {message}
              </motion.p>
            )}
          </form>
        </div>
      </motion.div>
    </>
  );
};
