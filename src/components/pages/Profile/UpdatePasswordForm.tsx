import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateProfilePassword } from '../../redux/slices/auth'

interface FormData {
  password: string
  oldPassword: string
}

interface Props {
  onSuccess: () => void
}

export const UpdatePasswordForm = (props: Props) => {
  const { onSuccess } = props

  const dispatch = useDispatch<AppDispatch>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: 'onSubmit' })

  const onSubmit = async (values: FormData) => {
    try {
      const action = await dispatch(updateProfilePassword(values))

      if (updateProfilePassword.fulfilled.match(action)) {
        onSuccess()
      } else {
        console.error('Err')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Err')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center ml-10"
    >
      <div className="flex flex-col my-2">
        <div className="flex">
          <TextField
            {...register('oldPassword', {
              required: 'This field is required!',
            })}
            error={Boolean(errors.oldPassword?.message)}
            helperText={<div>{errors.oldPassword?.message}</div>}
            label="Old password"
            // type={showPassword ? 'text' : 'password'}
          />
        </div>
        <div className="mt-2 flex">
          <TextField
            {...register('password', {
              required: 'This field is required!',
            })}
            error={Boolean(errors.password?.message)}
            helperText={<div>{errors.password?.message}</div>}
            label="New password"
            // type={showPassword ? 'text' : 'password'}
          />
        </div>
        <div className="flex justify-center mt-2">
          <button
            type="submit"
            className="w-full h-[35px] bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 "
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}
