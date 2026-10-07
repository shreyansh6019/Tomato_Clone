import { useEffect, useState } from 'react'
import { useAppData } from '../context/useAppData';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { CgShoppingCart } from 'react-icons/cg';
import { MdApi } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

const Navbar = () => {
    const { isAuthenticated, city } = useAppData();
    const currentLocation = useLocation();

    const isHomePage = currentLocation.pathname === '/';
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search) {
                setSearchParams({ search });
            } else {
                setSearchParams({});
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, setSearchParams]);
    return (
        <div className="w-full bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link to={"/"} className="text-xl font-bold text-[#E23774]">
                    Tomato
                </Link>
                <div className="flex items-center gap-4">
                    <Link to={"/cart"} className="relative">
                        <CgShoppingCart className="h-6 w-6 text-[#E23774]" />
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E23774] font-semibold text-xs text-white">0</span>
                    </Link>
                    {isAuthenticated ? (
                        <Link to={"/account"} className="text-sm font-medium text-[#E23774]">
                            Profile
                        </Link>
                    ) : (
                        <Link to={"/login"} className="text-sm font-medium text-[#E23774]">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Search bar only on the home page */}
            {isHomePage && (
                <div className="border-t mx-auto max-w-7xl px-4 py-3">
                    <div className="mx-auto flex max-w-7xl items-center rounded-lg shadow-sm border relative">
                        <div className="flex items-center gap-2 px-3 border-r text-gray-700">
                            <MdApi className="h-4 w-4 text-[#E23774]" />
                            <span className="text-sm">{city || "Select City"}</span>
                        </div>
                        <div className="flex flex-1 items-center gap-2 px-3">
                            <BiSearch className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for restaurants..."
                                className="w-full py-2 outline-noneborder-gray-300 placeholder:text-gray-500 focus:ring-[#E23774] focus:border-[#E23774]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar