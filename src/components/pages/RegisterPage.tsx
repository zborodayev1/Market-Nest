import { Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useSpring, animated } from '@react-spring/web'
import { useSelector } from "react-redux";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
import {
    selectIsAuth,
  } from "../../components/redux/slices/auth";
import { Navigate } from "react-router-dom";
// import { Register } from '../redux/store';

export const RegisterPage = () => {
    const text = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 200,
    })
    const div = useSpring({
        from: { y: 100, width: '0px', height: '0px' },
        to: { y: 0, width: '400px', height: '500px' },
        delay: 10,
    })
    const img = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1 },
        delay: 50,
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
    const textField3 = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1 },
        delay: 100,
    })
    const button = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: 0, opacity: 1 },
        delay: 100,
    })

    // const [err, setErr] = useState<string | null>(null);
    const isAuth = useSelector(selectIsAuth);
    // const dispatch = useDispatch();
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors, isValid },
    // } = useForm({
    //     defaultValues: {
    //         fullName: "",
    //         email: "",
    //         password: "",
    //     },
    //     mode: "all",
    // });

    // const onSubmit = async (values: {
    //     fullName: string;
    //     password: string | number;
    //     email: string;
    // }) => {
    //     try {
    //       const data = await dispatch(fetсhRegister(values));
    
    //       if (!data.payload) {
    //         return setErr("Uncorrect data");
    //       }
    
    //       if ("token" in data.payload) {
    //         window.localStorage.setItem("token", data.payload.token);
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       setErr("Error registration");
    //     }
    //   };
    
      if (isAuth) {
        return <Navigate to="/" />;
      }

    return (
        <div>
          <div className="bg-[#fafafa] h-screen flex flex-wrap justify-center">
            <animated.div style={{ ...div }} className="bg-[#ffff] shadow-lg px-16 mt-5 pt-8 w-[400px] h-[500px] phone:max-w-90 phone-md:max-w-96 rounded-md">
                <div>
                    <animated.div style={{...text}} className="flex justify-center">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#173f35] to-[#14594c]">Register</h1>
                    </animated.div>
                    <animated.div style={{ ...img }} className="flex justify-center mt-3 mb-3">
                        <Avatar sx={{ width: 70, height: 70 }} src="/broken-image.jpg" />
                    </animated.div>
                    <div >
                        <animated.div style={{ ...textField1 }} className="flex justify-center mb-5">
                        <TextField

                            id="outlined-basic" label="FullName" variant="outlined"
                        />
                        </animated.div>
                        <animated.div style={{ ...textField2 }} className="flex justify-center mb-5">
                        <TextField
                            label="E-mail"
                        />
                        </animated.div>
                        <animated.div style={{ ...textField3 }} className="flex justify-center mb-5">
                        <TextField
                            label="Password"
                        />
                        </animated.div>
                        <animated.div style={{ ...button }} className="flex justify-center">
                            <button 
                                className="w-[200px] h-10 bg-gradient-to-r from-[#173f35] to-[#14594c] text-white rounded-lg shadow-inner hover:from-[#14594c] hover:to-[#1a574a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14594c] focus:from-[#14594c] focus:to-[#1a574a] transition-all ease-in-out duration-300 ">
                                Create Account
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