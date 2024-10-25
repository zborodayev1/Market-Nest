import { Link } from "react-router-dom"
// import { LanguageDropdown } from "../dropdowns/LanguageDropdown";
// import { Dispatch, SetStateAction, useState } from "react";
// import { Box } from "@mui/material";

export const Header = () => {
  // const [language, setLanguage] = useState('ENG');

  return (
    <div>
      <div className="bg-[#Ffffff] mt-2 mb-2 p-2 h-16 flex justify-between shadow-md">
        <Link to="/" className="flex">
          <div className="ml-[50px] flex mt-2">
            <span className="max-laptopL:w-[150x] max-laptopL:h-[30px] text-2xl font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] hover:from-[#2f6f62] hover:to-[#267e6b] bg-clip-text text-transparent duration-300 transition-all ease-in-out ">Market Nest</span>
          </div>
          <img src="/Logo.png" className="w-[50px]"/>
        </Link>
        <div className="flex">
          {/* <div className="mr-5">
            <LanguageDropdown setLanguage={setLanguage as Dispatch<SetStateAction<string>>} />
          </div> */}
          <Link to='/register'>
            <button className="w-28 h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 ">
              Register
            </button>
          </Link>
          <Link to='/login' className="mx-3">
            <button className="w-28 h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] dark:from-[#0e2b26] dark:to-[#113c34] dark:hover:from-[#113c34] dark:hover:to-[#14594c] dark:focus:from-[#113c34] dark:focus:to-[#14594c] transition-all ease-in-out duration-300 ">
              Log in
            </button>
          </Link>
        </div>
      </div>
      
    </div>
  )
}
