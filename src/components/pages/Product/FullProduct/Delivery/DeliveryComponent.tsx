import { useSelector } from 'react-redux';
import { selectDeliveries } from '../../../../../redux/slices/deliverySlice';
import { Delivery } from '../../../../../redux/types/delivery.type';
import { DeliveryIcon } from '../../../../ui/customIcons/Delivery.icon';
import { DeliveryForm } from './DeliveryForm';

export const DeliveryComponent = () => {
  const delivery = useSelector(selectDeliveries);
  return (
    <div className="border border-[#6B7280] rounded-md">
      <div className="flex items-center gap-2 p-3">
        <DeliveryIcon />
        <h1 className="text-xl font-bold ">Delivery</h1>
      </div>
      <div className="border-[#e4e4e4] rounded-lg">
        {delivery &&
          delivery.map((delivery: Delivery) => (
            <DeliveryForm Delivery={delivery} />
          ))}
      </div>
    </div>
  );
};
