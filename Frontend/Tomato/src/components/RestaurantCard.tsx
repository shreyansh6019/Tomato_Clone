import type { IRestaurant } from '../types';

interface RestaurantCardProps {
  key: string;
  restaurant: IRestaurant;
  distance: string;
}
const RestaurantCard = ({ key, restaurant, distance }: RestaurantCardProps) => {
    // const { name, description, image, phone, isOpen } = restaurant;
    console.log(restaurant, "here", distance, "distance", key);
  return (
    <div>RestaurantCard</div>
  )
}

export default RestaurantCard