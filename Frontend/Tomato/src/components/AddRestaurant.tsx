import axios from 'axios';
import React from 'react'
import { restaurantService } from '../main';
import { useAppData } from '../context/useAppData';
import toast from 'react-hot-toast';
import { BiMapPin, BiUpload } from 'react-icons/bi';

interface AddRestaurantProps {
    fetchMyRestaurant: () => Promise<void>;
}

const AddRestaurant = ({ fetchMyRestaurant }: AddRestaurantProps) => {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [image, setImage] = React.useState<File | null>(null);

    const [submitting, setSubmitting] = React.useState(false);

    const { loadingLocation, location } = useAppData();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !phone || !location) {
            alert("Please fill all the fields");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("phone", phone);
        if (image) {
            formData.append("image", image);
        }
        formData.append("latitude", String(location.latitude));
        formData.append("longitude", String(location.longitude));
        formData.append("formattedAddress", location.formattedAddress);
        try {
            const res = await axios.post(`${restaurantService}/api/v1/restaurant/new`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success(res.data.message);
            fetchMyRestaurant();
        } catch (error) {
            console.log(error);
            const message = axios.isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : error instanceof Error
                    ? error.message
                    : undefined;
            toast.error(message ?? "An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm space-y-6">
                <h1 className="text-center text-3xl font-semibold text-[#E23774]">Add Restaurant</h1>
                <input type="text" placeholder="Name" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Phone" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <textarea placeholder="Description" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1" value={description} onChange={(e) => setDescription(e.target.value)} />
                {/* <label htmlFor="image" className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-4 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1">
                    <BiUpload className="h-5 w-5 text-[#E23774]" />
                    {image ? image.name : "Upload image"}
                    <input type="file" accept="image/*" hidden className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                </label> */}
                <div>
  {/* The clickable UI box */}
  <label 
    htmlFor="image-upload" 
    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-4 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1"
  >
    <BiUpload className="h-5 w-5 text-[#E23774]" />
    {image ? image.name : "Upload image"}
  </label>

  {/* The actual hidden input file element outside the label */}
  <input 
    id="image-upload" // Matches the htmlFor value above
    type="file" 
    accept="image/*" 
    className="hidden" // Hides it cleanly without breaking functionality
    onChange={(e) => setImage(e.target.files?.[0] || null)} 
  />
</div>

                <div className="flex items-center gap-3 rounded-lg border-gray-300 border p-4">
                    <BiMapPin className="mt-0.5 h-5 w-5 text-[#E23774]" />
                    <div className="text-sm text-gray-600">
                        {
                            loadingLocation
                                ? "Fetching your location..."
                                : location
                                    ? `${location.formattedAddress}`
                                    : "No location found"
                        }
                    </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full text-sm font-semibold rounded-lg bg-[#E23774] px-4 py-3 text-white hover:bg-[#d72c6a] focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1">
                    {submitting ? "Submitting..." : "Add Restaurant"}
                </button>
            </form>
        </div>
    )
}

export default AddRestaurant