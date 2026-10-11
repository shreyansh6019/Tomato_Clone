import axios from 'axios';
import { useState } from 'react'
import { restaurantService } from '../main';
import toast from 'react-hot-toast';
import { BiUpload } from 'react-icons/bi';

interface IProps {
    onItemAdded: (id: string) => void;
}

const AddMenuItem = ({ onItemAdded }: IProps) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);


    const resetForm = () => {
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !price || !image) {
            alert("Please fill all the fields");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("image", image);

        try {
            setLoading(true);
            const { data } = await axios.post(`${restaurantService}/api/v1/item/new`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Item added successfully");
            resetForm();
            onItemAdded(data.item.restaurantID);
            setLoading(false);
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
    return (
        <div className="max-w-md space-y-4 m-auto">
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold">Add Menu Item</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" />
                <input type="number" placeholder="Price ₹" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" />
                <div>
                    {/* The clickable UI box */}
                    <label
                        htmlFor="image-upload"
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-4 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1"
                    >
                        <BiUpload className="h-5 w-5 text-[#E23774]" />
                        {image ? image.name : "Upload image"}
                    </label>
                    <input
                        id="image-upload" // Matches the htmlFor value above
                        type="file"
                        accept="image/*"
                        className="hidden" // Hides it cleanly without breaking functionality
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full text-sm font-semibold rounded-lg bg-[#E23774] px-4 py-3 text-white hover:bg-[#d72c6a] focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1">
                    {loading ? "Submitting..." : "Add Item"}
                </button>
            </form>
        </div>
    )
}

export default AddMenuItem