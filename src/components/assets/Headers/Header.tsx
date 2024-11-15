import { Link } from 'react-router-dom'
import { selectIsAuth } from '../../redux/slices/auth'
import { useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search'
import { IoBagOutline } from 'react-icons/io5'
import { CiCirclePlus } from 'react-icons/ci'
import { CgProfile } from 'react-icons/cg'

export const Header = () => {
  const isAuth = useSelector(selectIsAuth)

  return (
    <div>
      <div className="bg-[#ffffff] ">
        <div className="relative  items-center mt-[50px] mb-[50px] px-[60px] flex ">
          <div className="absolute left-15 flex items-center">
            <SearchIcon />
          </div>
          <div className="absolute inset-x-0 flex justify-center items-center">
            <Link to="/">
              <div className="flex justify-center h-[45px]">
                <span className="text-3xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] hover:from-[#2f6f62] hover:to-[#267e6b] bg-clip-text text-transparent duration-300 transition-all ease-in-out ">
                  Market Nest
                </span>
              </div>
            </Link>
          </div>
          <div className="absolute right-6 flex items-center">
            {isAuth ? (
              <div className="flex">
                <Link to="/cart" className="mx-2 flex flex-col items-center">
                  <IoBagOutline
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  />
                  <h1 className="text-sm ">Bag</h1>
                </Link>
                <Link
                  to="/create-product"
                  className="mx-2 flex flex-col items-center"
                >
                  <CiCirclePlus style={{ width: 40, height: 40 }} />
                  <h1 className="text-sm">add product</h1>
                </Link>
                <Link to="/profile" className="mx-2 flex flex-col items-center">
                  <CgProfile color="action" style={{ width: 35, height: 40 }} />
                  <h1 className="text-sm">profile</h1>
                </Link>
              </div>
            ) : (
              <div className="flex">
                <Link to="/register">
                  <button className="w-28 h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 ">
                    Register
                  </button>
                </Link>
                <Link to="/login" className="mx-3">
                  <button className="w-28 h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 ">
                    Log in
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
