import { AnimatePresence, motion } from 'framer-motion';
import { Coins, ImagePlus, Package, Tags, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUserProfile } from '../../../../redux/slices/authSlice';
import {
  editProduct,
  getOneProduct,
  selectFullProduct,
} from '../../../../redux/slices/productSlice';
import { AppDispatch, RootState } from '../../../../redux/store';
import Input from '../../../ui/input/Input';

interface FormData {
  name: string;
  price: number;
  tags: string[];
  image: File | null;
}

export const EditProduct = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const product = useSelector(selectFullProduct);
  const userData = useSelector(selectUserProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags || []
  );
  const { error } = useSelector(
    (state: RootState) => state.products?.error || {}
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      tags: product?.tags || [],
      image: null,
    },
    mode: 'all',
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        price: product.price || 0,
        tags: product.tags || [],
        image: null,
      });
    }
  }, [product, reset]);

  useEffect(() => {
    if (id && (!product || product?._id !== id)) {
      dispatch(getOneProduct(id));
    }
  }, [id, dispatch, product]);

  useEffect(() => {
    if (userData?.role !== 'admin' && product?.user?._id !== userData?._id) {
      navigate('/');
    }
  }, [navigate, product?.user, userData]);

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
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price.toString());
    formData.append('tags', JSON.stringify(selectedTags));

    if (values.image instanceof File) {
      formData.append('image', values.image);
    }

    const isChanged =
      values.name !== product?.name ||
      values.price !== product?.price ||
      JSON.stringify(selectedTags) !== JSON.stringify(product?.tags) ||
      values.image instanceof File;

    if (!isChanged) {
      return navigate('/');
    }

    try {
      setIsSubmitting(true);

      await dispatch(editProduct({ productData: formData, id: id }));
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error editing product:', error);
    } finally {
      setIsSubmitting(false);
      navigate('/');
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

  const isNameError = errors.name ? true : false;
  const isPriceError = errors.price ? true : false;

  return (
    <>
      <Helmet>
        <title>Edit Product</title>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex justify-center items-center "
      >
        <div className="h-[1000px]">
          <h1 className="flex justify-center my-5 font-bold text-2xl">
            Edit Product
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="gap-2 px-15 py-7 rounded-2xl border-2"
          >
            <div>
              <label className="flex items-center gap-2 text-xl font-bold text-black  mb-1">
                <Package size={24} />
                Product Name
              </label>
              <Input
                type="text"
                icon={<Package size={18} />}
                register={register}
                isError={isNameError}
                inputStyle="w-[430px] pl-5 py-2"
                placeholder="Product Name"
                sircleWidth={36}
                sircleHeight={36}
                sircleTop={2}
                sircleRight={2}
                sircleHeightActive={40}
                sircleWidthActive={40}
                iconRight={10}
                iconTop={10}
                isDef={true}
                registerMaxLenghtValue={40}
                registerMaxLenghtMessage="Product Name must be at max 40 characters"
                registerName="name"
                registerReq="Product Name is required"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1 ml-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-2 text-xl font-bold text-black  mb-1">
                <Coins size={24} />
                Price
              </label>
              <Input
                type="number"
                icon={<Coins size={18} />}
                register={register}
                isError={isPriceError}
                inputStyle="w-[430px] pl-5 py-2"
                placeholder="Product price"
                sircleWidth={36}
                sircleHeight={36}
                sircleTop={2}
                sircleRight={2}
                sircleHeightActive={40}
                sircleWidthActive={40}
                iconRight={10}
                iconTop={10}
                isDef={true}
                registerMaxLenghtValue={40}
                registerMaxLenghtMessage="Product price must be at max 40 characters"
                registerName="price"
                registerReq="Product price is required"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1 ml-2">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label className="flex items-center gap-2 text-base font-bold text-black  mb-1">
                <Tags size={20} />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-w-[440px]">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-full transition-colors ease-in-out duration-300 delay-50
                    ${
                      selectedTags.includes(tag)
                        ? 'bg-[#2B6128] text-white hover:bg-[#3C8737]'
                        : 'bg-gray-200 text-gray-800 hover:bg-[#1f5e1c]'
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
                    className="mt-3 flex justify-center relative "
                  >
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-[350px] h-[200px] object-cover rounded-lg shadow-xl"
                    />
                    <X
                      size={35}
                      type="button"
                      onClick={handleImageRemove}
                      className="absolute top-0 bg-gray-200 right-0 text-black rounded-xl p-2 hover:bg-[#3C8737] hover:text-white transition-colors ease-in-out duration-300 delay-50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-5 w-full p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] delay-50 transition-all duration-300  ease-in-out`}
            >
              <span className="text-[#fff] font-bold">
                {isSubmitting ? 'Editing...' : 'Edit Product'}
              </span>
            </button>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center mt-2"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>
      </motion.div>
    </>
  );
};
