export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

export interface AppContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    location: Location | null;
    loadingLocation: boolean;
    city: string | null;
    // fetchUser: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
    setLoadingLocation: React.Dispatch<React.SetStateAction<boolean>>;
    setCity: React.Dispatch<React.SetStateAction<string | null>>;
}