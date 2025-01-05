import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { Package, Coins, Tags, ImagePlus, X, Info, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { createProduct, selectProducts } from '../../../redux/slices/products'
import { AppDispatch } from '../../../redux/store'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

interface FormData {
  name: string
  price: number
  tags: string[]
  image: File | null
}

export const CreatePage = () => {
  const dispatch: AppDispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { error } = useSelector(selectProducts)
  const [message, setMessage] = useState<string>('')
  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      price: 0,
      tags: [],
      image: null,
    },
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      setValue('image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImagePreview(null)
    setValue('image', null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('price', values.price.toString())
      formData.append('tags', JSON.stringify(selectedTags))

      if (values.image instanceof File) {
        formData.append('image', values.image)
      } else {
        formData.append('image', '')
      }
      await dispatch(createProduct(formData)).unwrap()

      toast('Successfully created!', {
        type: 'success',
        onClose: () => navigate('/'),
      })
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message || 'An unknown error occurred'
      setMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag)
      } else {
        return [...prevTags, tag]
      }
    })
  }

  const availableTags = [
    'Clothes',
    'Electronics',
    'House & Garden',
    'Construction and repair',
    'Sport',
    "Children's products",
    'Decorations and luxury',
  ]

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
        initial={{ opacity: 0, filter: 'blur(5px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(5px)' }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex justify-center items-center mt-5"
      >
        <div>
          <h1 className="flex justify-center mb-5 font-bold text-2xl">
            Create Product
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="gap-2 bg-[#f5f5f5] p-5 px-6 rounded-2xl shadow-xl"
          >
            <div>
              <label className="flex items-center gap-2 text-xl font-bold text-black dark:text-gray-300 mb-1">
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
              <label className="flex items-center gap-2 text-xl font-bold text-black dark:text-gray-300 mb-1">
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
              <label className="flex items-center gap-2 text-xl font-bold text-black dark:text-gray-300 mb-1">
                <Tags size={24} />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-w-[440px]">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/3 px-4 py-2 rounded-lg transition-colors ease-in-out duration-300 
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
              <label className="flex  items-center gap-2 text-xl font-bold text-black dark:text-gray-300 mb-1">
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
                    className="w-[430px] h-[200px] border-dashed border-2 border-[#212121] flex justify-center items-center hover:bg-[#e4e4e4] transition-colors ease-in-out duration-300"
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
                      className="absolute top-0 bg-red-500 right-0 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-5 w-full p-2 rounded-xl flex justify-center items-center text-[#fff] bg-[#3C8737] hover:bg-[#2b6128] hover:-translate-y-1 transition-all duration-300 ease-in-out`}
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
  )
}
