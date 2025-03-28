import { Delivery } from '../../../../../redux/types/delivery.type';

interface Props {
  Delivery: Delivery;
}

export const DeliveryForm = (props: Props) => {
  const { Delivery } = props;
  return (
    <button className="grid w-full text-start text-lg pl-5 py-3 cursor-pointer hover:bg-[#e4e4e4] duration-300 delay-50">
      <div className="flex gap-1 ml-2">
        <h1 className="font-bold">{Delivery.name}</h1>
        <h1 className="font-bold flex gap-[1px]">
          {Delivery.price}
          <p>$</p>
        </h1>
      </div>
      <p className="text-black/75 text-sm ml-2">{Delivery.desc}</p>
    </button>
  );
};
