import React from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { animated } from '@react-spring/web'
interface ProfileFieldButtonProps {
  title: string
  value: string
  animationStyle: React.CSSProperties
  onClick?: () => void
}

export const ProfileButton: React.FC<ProfileFieldButtonProps> = ({
  animationStyle,
  title,
  value,
  onClick,
}) => {
  return (
    <animated.button
      style={animationStyle}
      className="flex flex-col w-full focus:bg-[#DEE4EC] pt-2 pl-2 pr-2 duration-300"
      onClick={onClick}
    >
      <div className="flex justify-between w-full">
        <h1 className="text-xl font-bold ">{title}</h1>
        <div className="flex">
          <h1 className="">{value}</h1>
          <div className="ml-2">
            <ChevronRightIcon fontSize="small" />
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full mt-2 bg-[#DEE4EC]"></div>
    </animated.button>
  )
}
