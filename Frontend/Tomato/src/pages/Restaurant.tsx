import { useEffect, useState } from "react";
import { restaurantService } from "../main";
import type { IMenuItem, IRestaurant } from "../types";
import axios from "axios";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantProfile from "../components/RestaurantProfile";
import MenuItem from "../components/MenuItems";
import AddMenuItems from "../components/AddMenuItem";
import toast from "react-hot-toast";

type SellerTab = "menu" | "add-item" | "sales"

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<SellerTab>("menu");
    const [items, setItems] = useState<IMenuItem[]>([]);

    const fetchItems = async (restaurantId: string) => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/v1/item/all/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setItems(data.menuItems);
        }
        catch (error) {
            console.log(error);
            toast.error(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "An error occurred"
                    : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    }

    const fetchRestaurant = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/v1/restaurant/my`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRestaurant(data.restaurant || null);
            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.reload();
            }
        }
        catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void Promise.resolve().then(fetchRestaurant);
    }, []);

    useEffect(() => {
        if(restaurant) {
            void Promise.resolve().then(() => fetchItems(restaurant?._id));
        }
    }, [restaurant]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading your restaurant...</div>
    }

    if (!restaurant) {
        return <AddRestaurant fetchMyRestaurant={fetchRestaurant} />
    }
    return (
        <div className="flexmin-h-screen items-center justify-center bg-gray-50 px-4 py-6 space-y-6">
            <RestaurantProfile restaurant={restaurant} isSeller={true} onUpdate={setRestaurant} />
            <div className="rounded-xl bg-white shadow-sm">
                <div className="flex">
                    {[
                        {key: "menu", label: "Menu"},
                        {key: "add-item", label: "Add Item"},
                        {key: "sales", label: "Sales"},
                    ].map((t) => (
                        <button key={t.key} onClick={() => setTab(t.key as SellerTab)} className={`flex-1 px-4 py-3 text-sm font-medium transition ${t.key === tab ? "border-b-2 border-red-500 text-red-500" : "text-gray-500 hover:text-gray-100"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="p-5">
                    {tab === "menu" && <MenuItem menuItems={items} onItemDeleted={() => fetchItems(restaurant?._id)} isSeller={true} />}
                    {tab === "add-item" && <AddMenuItems onItemAdded={() => fetchItems(restaurant?._id)} />}
                    {tab === "sales" && <div>Sales</div>}
                </div>
            </div>
        </div>
    )
}

export default Restaurant