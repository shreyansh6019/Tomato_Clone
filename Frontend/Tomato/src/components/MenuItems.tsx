import { useState } from 'react'
import type { IMenuItem } from '../types';
import { FiEyeOff } from 'react-icons/fi';
import { BsCartPlus, BsEye } from 'react-icons/bs';
import { BiLoader, BiTrash } from 'react-icons/bi';
import axios from 'axios';
import { restaurantService } from '../main';
import toast from 'react-hot-toast';

interface MenuItemProps {
  menuItems: IMenuItem[];
  onItemDeleted: () => void;
  isSeller: boolean;
}
const MenuItem = ({
  menuItems,
  onItemDeleted,
  isSeller,
}: MenuItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) {
      return;
    }
    try {
      const { data } = await axios.delete(`${restaurantService}/api/v1/item/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data);
      toast.success("Item deleted successfully");
      onItemDeleted();
    }
    catch (error) {
      console.log(error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "An error occurred"
          : "An error occurred"
      );
    }
  }

  const toggleAvailability = async (id: string) => {
    try {
      const { data } = await axios.patch(`${restaurantService}/api/v1/item/status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      console.log(data);
      toast.success("Item status updated successfully");
      onItemDeleted();
    }
    catch (error) {
      console.log(error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "An error occurred"
          : "An error occurred"
      );
    }
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {
        menuItems.map((item) => {
          const isLoading = loadingItemId === item._id;
          return (
            <div key={item._id} className={`relative flex gap-4 rounded-lg bg-white p-4 shadow-sm transition ${!item.isAvailable ? "opacity-70" : ""}`}>
              <div className="relative shrink">
                <img src={item.image} alt={item.name} className={`h-20 w-20 rounded object-cover ${!item.isAvailable ? "grayscale brightness-75" : ""}`} />
                {!item.isAvailable && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-semibold text-white">Not Available</div>}
              </div>
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">₹{item.price}</p>
                  {
                    isSeller && (<div>
                      <button onClick={() => toggleAvailability(item._id)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        {item.isAvailable ? <BsEye size={18} /> : <FiEyeOff size={18} />}
                      </button>

                      <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                        <BiTrash size={18} />
                      </button>
                    </div>
                    )
                  }
                  {
                    !isSeller &&
                    <button disabled={!item.isAvailable || isLoading} onClick={() => { }}
                      className={`flex items-center justify-center p-2 rounded-lg ${!item.isAvailable || isLoading ? "text-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-50"}`}>
                      {isLoading ? <BiLoader size={18} className="animate-spin" /> : <BsCartPlus size={18} />}
                    </button>
                  }
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default MenuItem