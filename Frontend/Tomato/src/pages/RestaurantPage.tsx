import { useEffect, useState } from "react";
import type { IMenuItem, IRestaurant } from "../types";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { restaurantService } from "../main";
import RestaurantProfile from "../components/RestaurantProfile";
import MenuItem from "../components/MenuItems";

const RestaurantPage = () => {
    const { id } = useParams();

    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRestaurant = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/v1/restaurant/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setRestaurant(data || null);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchMenuItems = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/v1/item/all/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMenuItems(data.menuItems);
        }
        catch (error) {
            console.log(error);
            toast.error(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "An error occurred"
                    : "An error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        queueMicrotask(() => {
            fetchRestaurant();
            if (id) fetchMenuItems();
        });
    }, [id]);

    if (isLoading) {
        return <div className="flex min-h-screen h-[60vh] items-center justify-center text-gray-500">Finding restaurants near you...</div>
    }

    if(!restaurant) {
        return <div className="flex min-h-screen h-[60vh] items-center justify-center text-gray-500">Restaurant not found</div>
    }
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">
            <RestaurantProfile restaurant={restaurant} isSeller={false} onUpdate={setRestaurant} />
            <div className="rounded-xl bg-white shadow-sm" p-4>
                <MenuItem isSeller={false} menuItems={menuItems} onItemDeleted={() => fetchMenuItems()} />
            </div>
        </div>
    )
}

export default RestaurantPage;