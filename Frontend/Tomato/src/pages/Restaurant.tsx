import { useEffect, useState } from "react";
import { restaurantService } from "../main";
import type { IRestaurant } from "../types";
import axios from "axios";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantProfile from "../components/RestaurantProfile";

type SellerTab = "menu" | "add-item" | "sales"

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<SellerTab>("menu");

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
                    {tab === "menu" && <div>Menu</div>}
                    {tab === "add-item" && <div>Add Item</div>} 
                    {tab === "sales" && <div>Sales</div>}
                </div>
            </div>
        </div>
    )
}

export default Restaurant