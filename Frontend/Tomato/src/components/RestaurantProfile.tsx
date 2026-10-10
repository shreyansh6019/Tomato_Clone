import { useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import toast from "react-hot-toast";
import { restaurantService } from "../main";
import { BiEdit, BiMapPin, BiSave } from "react-icons/bi";

interface RestaurantProfileProps {
    restaurant: IRestaurant | null;
    isSeller: boolean;
    onUpdate: (restaurant: IRestaurant) => void;
}
const RestaurantProfile = ({
    restaurant,
    isSeller,
    onUpdate,
}: RestaurantProfileProps) => {

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(restaurant?.name || "");
    const [description, setDescription] = useState(restaurant?.description || "");
    const [isOpen, setIsOpen] = useState(restaurant?.isOpen || false);
    const [loading, setLoading] = useState(false);

    const toggleOpenStatus = async () => {
        try {
            setLoading(true);
            const { data } = await axios.patch(`${restaurantService}/api/v1/restaurant/status`, {
                status: !isOpen
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setIsOpen(data.restaurant.isOpen);
            toast.success(data.message);
            onUpdate(data.restaurant);
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    const saveChanges = async () => {
        try {
            setLoading(true);
            const { data } = await axios.patch(`${restaurantService}/api/v1/restaurant/edit`, {
                name,
                description,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            onUpdate(data.restaurant);
            toast.success(data.message);
            setEditMode(false);
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="mx-auto max-w-xl rounded-xl bg-white shadow-sm overflow-hidden">
            {restaurant?.image && <img src={restaurant.image} alt="Restaurant Image" className="w-full h-48 object-cover" />}
            <div className="p-5 space-y-4">
                {
                    isSeller &&
                    <div className="flex items-start justify-between">
                        <div>
                            {
                                editMode ? (
                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="w-full rounded border border-gray-300 px-2 py-1 text-lg font-normal placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" />
                                ) : <h2 className="text-xl font-semibold">{restaurant?.name}</h2>
                            }
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                <BiMapPin className="h-4 w-4 text-[#E23774]" />
                                <p>{restaurant?.autoLocation.formattedAddress || "Location Unavailable"}</p>
                            </div>
                        </div>
                        <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 text-gray-600">
                            <BiEdit size={18} />
                        </button>
                    </div>
                }

                {
                    editMode ? (
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-normal placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" />
                    ) : <p className="text-sm text-gray-600">{restaurant?.description || "No description available"}</p>
                }

                <div className="flex items-center justify-between pt-3 border-t">
                    <span className={`text-sm font-medium ${isOpen ? "text-green-600" : "text-red-500"}`}>{isOpen ? "Open" : "Closed"}</span>
                    <div className="flex gap-3">
                        {
                            editMode && (
                                <button onClick={saveChanges} disabled={loading} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <BiSave size={16} />
                                    Save Changes
                                </button>
                            )}
                        {
                            isSeller && (
                                <button onClick={toggleOpenStatus} disabled={loading} className={`flex items-center gap-1 rounded-lg px-4 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>
                                    <BiSave size={16} />
                                    {isOpen ? "Close Restaurant" : "Open Restaurant"}
                                </button>
                            )
                        }
                    </div>
                </div>
                <p className="text-sm text-gray-500">Created on {restaurant?.createdAt ? new Date(restaurant.createdAt).toLocaleDateString() : "Unavailable"}</p>
            </div>
        </div>
    )
}

export default RestaurantProfile