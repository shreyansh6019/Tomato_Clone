import { useNavigate } from 'react-router-dom';
import type { IRestaurant } from '../types';

interface RestaurantCardProps {
  id: string;
  restaurant: IRestaurant;
  distance: string;
}
const RestaurantCard = ({ id, restaurant, distance }: RestaurantCardProps) => {
  const { name, image, isOpen } = restaurant;
  const navigate = useNavigate();
  console.log(restaurant, "here", distance, "distance", id);
  return (
    <div className={`cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md ${!isOpen ? "opacity-80" : ""}`}
      onClick={() => navigate(`/restaurant/${id}`)}
    >
      <div className=" relative, h-40 w-full overflow-hidden">
        <img src={image} alt="restaurant" className={`h-full w-full object-cover transition duration-3oo hover:scale-105 ${!isOpen ? "grayscale" : ""}`} />
        {!isOpen && <div className="absolute inset-0 items-center flex justify-center bg-black/50">
          <span className="text-white text-sm font-semibold px-3 py-1 rounded-md">Closed</span>
        </div>}
      </div>
      <div className="p-4">
        <h3 className="text-base truncate text-gray-800 font-semibold">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{distance} KM Away</p>
      </div>
    </div>
  )
}

export default RestaurantCard