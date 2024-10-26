import { useSpring, animated } from '@react-spring/web'

export const AboutMarket = () => {
  const title = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 300,
  })
  const text = useSpring({
    from: { opacity: 0, y: 100 },
    to: { opacity: 1, y: 0 },
    delay: 700,
  })
  const div = useSpring({
    from: { y: 100, width: '0px', height: '0px' },
    to: { y: 0, width: '650px', height: '300px' },
    delay: 50,
  })
  return (
    <div className="bg-[#fafafa] flex h-screen justify-center">
      <animated.div
        style={{ ...div }}
        className="bg-white mt-5 rounded-md h-[300px] w-[650px] shadow-lg"
      >
        <animated.div style={{ ...title }} className="mb-3 ml-[150px]">
          <h1 className="w-[500px] text-4xl mt-[20px] font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] bg-clip-text text-transparent">
            About This Market
          </h1>
        </animated.div>
        <animated.div style={{ ...text }} className="flex justify-center">
          <h1 className="w-[500px]">
            <a className="font-bold bg-gradient-to-r from-[#173f35] to-[#14594c] bg-clip-text text-transparent">
              Market Nest
            </a>{' '}
            is a one-stop online trading platform where buyers and sellers find
            each other for great deals. The site features a variety of products
            and services that can be purchased or offered for sale, from
            clothing and electronics to unique crafts and antiques. Convenient
            search and filtering tools make it easy for users to find the
            products they need, while an intuitive interface and secure payment
            support make shopping on MarketNest convenient and secure.
          </h1>
        </animated.div>
      </animated.div>
    </div>
  )
}
