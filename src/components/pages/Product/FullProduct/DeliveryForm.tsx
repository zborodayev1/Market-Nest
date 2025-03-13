import { Delivery } from '../../../../redux/types/delivery';

interface Props {
  Delivery: Delivery;
}

export const DeliveryForm = (props: Props) => {
  const { Delivery } = props;
  return (
    <button className="grid w-full text-start">
      <div className="flex gap-1 ml-2">
        <h1 className="font-bold">{Delivery.name}</h1>
        <h1 className="font-bold flex gap-[1px]">
          {Delivery.price}
          <p>$</p>
        </h1>
      </div>
      <p className="text-black/75 text-sm ml-2">{Delivery.desc}</p>
      <div className="py-4">
        <hr />
      </div>
    </button>
  );
};
