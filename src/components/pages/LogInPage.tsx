import { TextField } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
export const LogInPage = () => {
    const text = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 200,
    })
    const main = useSpring({
        from: { y: 100, width: '0px', height: '0px' },
        to: { y: 0, width: '400px', height: '400px' },
        delay: 10,
    })
    const textField1 = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1 },
        delay: 100,
    })
    const textField2 = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1 },
        delay: 100,
    })
    const button = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1 },
        delay: 100,
    })
    return (
        <div>
        <div className="bg-[#fafafa] h-screen flex flex-wrap justify-center">
          <animated.div style={{...main}} className="bg-[#ffff] shadow-lg px-16 mt-5 pt-8 w-[400px] h-[400px] items-center phone:max-w-90 phone-md:max-w-96 rounded-md">
              <div>
                  <animated.div style={{...text}} className="flex justify-center">
                      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c] mb-10">Log In</h1>
                  </animated.div>
                  <div >
                      <animated.div style={{ ...textField1 }} className="flex justify-center mb-5">
                      <TextField
                          label="E-mail"
                      />
                      </animated.div>
                      <animated.div style={{ ...textField2 }} className="flex justify-center mb-5">
                      <TextField
                          label="Password"
                      />
                      </animated.div>
                      <animated.div style={{ ...button }} className="flex justify-center">
                          <button 
                              className="w-[200px] h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] transition-all ease-in-out duration-300 ">
                              Log in
                          </button>
                      </animated.div>
                  </div>
                  {/* <h1 className="text-[#D3312F] mt-2 text-sm ml-3">err</h1> */}
              </div>
          </animated.div>
        </div>
      </div>
    );
}