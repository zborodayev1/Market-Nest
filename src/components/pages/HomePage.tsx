import { animated, useSpring } from "@react-spring/web";
import { Link } from "react-router-dom";

export const HomePage = () => {

  const h1 = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 300,
    duration: 400
  })
  const button = useSpring({
    from: { opacity: 0, y:100 },
    to: { opacity: 1, y:0 },
    delay: 1000,
    duration: 400
  })
  const span = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 700,
    duration: 400
  })
  const image = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 700,
    duration: 400
  })


  return (
    <div className="h-screen  bg-[#fafafa]">
      <div className="flex justify-center">
        <div className="flex">
            <div className="ml-[50px] flex mt-2">
              <animated.h1 style={{...h1}} className="text-4xl max-laptopL:h-[50px] mr-2">Welcome to</animated.h1>
              <animated.span style={{...span}} className="text-4xl max-laptopL:h-[50px] font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] bg-clip-text text-transparent">Market Nest</animated.span>
            </div>
            <animated.img style={{...image}} src="/Logo.png" className="w-[50px] h-[50px]"/>
          </div>
      </div>
      <Link to='/about' className="flex justify-center">
        <animated.button style={{...button}} className="bg-gradient-to-r from-[#173f35] to-[#14594c] bg-clip-text text-transparent hover:underline">About this project</animated.button>
      </Link>
    </div>
  );
};
