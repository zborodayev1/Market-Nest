import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <Link
      to="/"
      className="bg-[#fafafa] flex justify-center mt-5 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] font-bold"
    >
      Not Found
    </Link>
  )
}
