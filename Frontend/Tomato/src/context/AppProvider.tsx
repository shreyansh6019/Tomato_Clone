import { useState, useEffect, useMemo } from "react"; // 1. Import useMemo
import { authService } from "../main";
import axios from "axios";
import type { User, Location } from "../types";
import { AppContext } from "./AppContext";

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const [location, setLocation] = useState<Location | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState<string | null>("Fetching location...");

    async function fetchUser() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                return;
            }
            const response = await axios.get(`${authService}/api/v1/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error fetching user:", error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void Promise.resolve().then(fetchUser);
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return alert("Please allow location to continue");

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setLoadingLocation(true);

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                setLocation({
                    latitude,
                    longitude,
                    formattedAddress: data.display_name || "Current Location"
                });
                setCity(data.address.city || data.address.town || data.address.village || "Your Location");
            } catch {
                setLocation({
                    latitude,
                    longitude,
                    formattedAddress: "Current Location"
                });
                setCity("Failed to load");
            } finally {
                setLoadingLocation(false);
            }
        }, () => {
            setLoadingLocation(false);
            setCity("Location unavailable");
        });
    }, []);

    // 2. Memoize the context value so it doesn't break child references
    const contextValue = useMemo(() => ({
        isAuthenticated,
        user,
        loading,
        location,
        loadingLocation,
        city,
        setUser,
        setIsAuthenticated,
        setLoading,
        setLocation,
        setLoadingLocation,
        setCity
    }), [isAuthenticated, user, loading, location, loadingLocation, city]); // Re-runs only when these change

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
