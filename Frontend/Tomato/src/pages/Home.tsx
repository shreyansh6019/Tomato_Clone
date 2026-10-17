import { useSearchParams } from "react-router-dom";
import { useAppData } from "../context/useAppData";
import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import RestaurantCard from "../components/RestaurantCard";

const Home = () => {
  const { location } = useAppData();
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;  // deg2rad below
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  }

  const fetchRestaurants = async () => {
    if (!location?.latitude || !location?.longitude) {
      // alert("You need to give permission to access your location");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${restaurantService}/api/v1/restaurant/all`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: 5000,
            search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurants(data.restaurants ?? []);
    }
    catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(fetchRestaurants);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, search]);

  console.log("processing restaurants", restaurants, location, loading);

  if (loading || !location) {
    return <div className="flex min-h-screen h-[60vh] items-center justify-center text-gray-500">Finding restaurants near you...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {
        restaurants.length > 0 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {restaurants.map((restaurant) => {
            const [ resLongitude, resLatitude ] = restaurant.autoLocation.coordinates;
            const distance = getDistanceInKm(location.latitude, location.longitude, resLatitude, resLongitude);
            return <RestaurantCard id={restaurant._id} restaurant={restaurant} distance={distance} />
          })}
        </div> : <p className="text-center text-lg font-semibold text-gray-500">No restaurants found</p>
      }
    </div>
  )
}

export default Home