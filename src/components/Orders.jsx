import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username') || 'Guest';
        setUsername(storedUsername);

        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://react-backend-ecom.onrender.com/orders');
                setOrders(response.data.orders || response.data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
                    <p className="text-gray-600">Welcome back, {username}!</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-600">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                        <a href="/products" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                            Browse Products
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Shipping to: {order.shippingInfo.fullName}, {order.shippingInfo.city}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="border-t pt-4">
                                    {order.products && order.products.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex gap-4 mb-3">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/80'}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                                                </div>
                                                <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t mt-4 pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal:</span>
                                            <span>₹{order.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping:</span>
                                            <span>₹{order.shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t pt-2">
                                            <span className="text-lg font-bold">Total:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                ₹{order.total.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Payment Method:</span>
                                            <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
