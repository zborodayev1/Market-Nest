import { PackageCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserProfile } from '../../../../../../redux/slices/authSlice';

interface Props {
  onSuccess: () => void;
}

export const SideBarPemdingProductsForm: React.FC<Props> = (props) => {
  const { onSuccess } = props;
  const userData = useSelector(selectUserProfile);
  const nav = useNavigate();
  const handleRedirect = () => {
    onSuccess();
    nav('/products-pending');
  };
  return (
    <div>
      {userData?.role === 'admin' && (
        <div>
          <div className="hover:bg-gray-200 z-10 p-1 py-3 transition-colors duration-300 rounded-xl ease-in-out flex items-center mb-2">
            <button
              onClick={handleRedirect}
              className="mx-1 flex gap-2 items-center "
            >
              <h1 className="text-sm font-bold text-[#212121]  transition-colors duration-200 ">
                Pending Products
              </h1>
              <PackageCheck className="w-6 h-6 text-[#212121] transition-colors duration-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
