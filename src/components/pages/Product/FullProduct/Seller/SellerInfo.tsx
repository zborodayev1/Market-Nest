import { Avatar } from '@mui/material'
import { formatPhoneNumber } from '../../../../assets/functons/format/phone/PhoneFormat'
import { UserProfile } from '../../../../redux/slices/auth'

interface Props {
  user: UserProfile | null
}

export const SellerInfo = (props: Props) => {
  const { user } = props
  return (
    <div>
      <div className="flex gap-3 mt-3 bg-[#e4e4e4] p-5 rounded-md">
        {user?.avatarUrl ? (
          <img
            className="rounded-full w-[50px] h-[50px]"
            src={user?.avatarUrl}
          />
        ) : (
          <Avatar style={{ width: 50, height: 50 }} />
        )}
        <div>
          <div>
            <h1 className="font-bold  text-base">{user?.fullName}</h1>
          </div>
          <div>
            <h1 className="font-bold text-base ">
              {user?.phone && formatPhoneNumber(user.phone)}
            </h1>
          </div>
          <div className="flex gap-2 text-base">
            <div>
              <h1>{user?.address},</h1>
            </div>
            <div>
              <h1>{user?.city},</h1>
            </div>
            <div>
              <h1>{user?.country}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
