import { useContext } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, refreshCart } = useContext(AppContext);
    const navigate = useNavigate();
    const total = cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    const handleCheckout = async () => {
        if (!cart || cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            const orderData = {
                products: cart.map(item => ({
                    product: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                })),
                shippingInfo: {
                    fullName: sessionStorage.getItem('username') || 'Guest',
                    email: 'customer@example.com',
                    address: 'Default Address',
                    city: 'Default City',
                    zipCode: '000000'
                },
                paymentMethod: 'cod',
                subtotal: total,
                shipping: 40,
                total: total + 40
            };

            await axios.post('https://react-backend-ecom.onrender.com/orders', orderData);
            toast.success('Order placed successfully!');
            await refreshCart();
            setTimeout(() => navigate('/orders'), 1000);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to place order';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-green-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Cart Details</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-3/4">
                        {!cart || cart.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-gray-600 text-lg">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                                        <img
                                            src={item.image || "https://via.placeholder.com/100"}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600">₹{item.price}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    updateQuantity(item._id, item.quantity - 1);
                                                    if (item.quantity - 1 === 0) {
                                                        toast.info('Item removed from cart');
                                                    } else {
                                                        toast.success('Quantity updated');
                                                    }
                                                }}
                                                className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => {
                                                    updateQuantity(item._id, item.quantity + 1);
                                                    toast.success('Quantity updated');
                                                }}
                                                className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right w-24">
                                            <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                removeFromCart(item._id);
                                                toast.error('Item removed from cart');
                                            }}
                                            className="text-red-500 hover:text-red-700 font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-semibold">₹40.00</span>
                                </div>
                                <div className="flex justify-between">
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            ₹{(total + 40).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={!cart || cart.length === 0}
                                onClick={handleCheckout}
                                className={`w-full py-3 rounded-lg font-semibold transition ${!cart || cart.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
