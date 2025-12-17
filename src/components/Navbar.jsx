import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

const NavigationBar = ({ cartCount = 0 }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useContext(AppContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
                <Link to="/" className="text-2xl font-bold hover:text-gray-300">
                    Techify
                </Link>
                <div className="space-x-4 text-lg font-medium">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    {isLoggedIn && <Link to="/products" className="hover:text-gray-300">Products</Link>}
                    {isLoggedIn && <Link to="/orders" className="hover:text-gray-300">Orders</Link>}
                    {isLoggedIn && user?.role === 'admin' && <Link to="/admin" className="hover:text-gray-300">Admin</Link>}
                </div>
                <div className="space-x-4 flex items-center">
                    {isLoggedIn && (
                        <Link
                            to="/cart"
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 relative"
                        >
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}
export default NavigationBar