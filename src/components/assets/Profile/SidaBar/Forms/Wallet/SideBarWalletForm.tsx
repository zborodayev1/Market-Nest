import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSuccess: () => void;
}

export const SideBarWalletForm: React.FC<Props> = (props) => {
  const { onSuccess } = props;
  const nav = useNavigate();
  const handleRedirect = () => {
    onSuccess();
    nav('/wallet');
  };
  return (
    <div>
      <div>
        <div className="hover:bg-gray-200 z-10 p-1 py-3 transition-colors duration-300 rounded-xl ease-in-out flex items-center ">
          <button
            onClick={handleRedirect}
            className="mx-1 flex gap-2 items-center "
          >
            <h1 className="text-sm font-bold text-[#212121]  transition-colors duration-200 ">
              Wallet
            </h1>

            <CreditCard className="w-6 h-6 text-[#212121] transition-colors duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
