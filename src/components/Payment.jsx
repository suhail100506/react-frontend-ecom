import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';

const Payment = () => {
    const { cart, refreshCart } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { total } = location.state || { total: 0 };

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shippingInfo, setShippingInfo] = useState({
        fullName: sessionStorage.getItem('username') || '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone ||
            !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
            toast.error('Please fill all shipping details');
            return false;
        }

        if (paymentMethod === 'card') {
            if (!cardDetails.cardNumber || !cardDetails.cardName || 
                !cardDetails.expiryDate || !cardDetails.cvv) {
                toast.error('Please fill all card details');
                return false;
            }
            if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
                toast.error('Card number must be 16 digits');
                return false;
            }
            if (cardDetails.cvv.length !== 3) {
                toast.error('CVV must be 3 digits');
                return false;
            }
        }

        if (paymentMethod === 'upi' && !upiId) {
            toast.error('Please enter UPI ID');
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setIsProcessing(true);

        try {
            const orderData = {
                products: cart.map(item => ({
                    product: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                })),
                shippingInfo,
                paymentMethod,
                subtotal: total,
                shipping: 40,
                total: total + 40
            };

            await axios.post('https://react-backend-ecom.onrender.com/orders', orderData);
            toast.success('Order placed successfully!');
            await refreshCart();
            setTimeout(() => navigate('/orders'), 1500);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to place order';
            toast.error(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment & Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={shippingInfo.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                                        readOnly
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingInfo.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={shippingInfo.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                            
                            <div className="space-y-4">
                                {/* Cash on Delivery */}
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
                                    onClick={() => setPaymentMethod('cod')}
                                    style={{ borderColor: paymentMethod === 'cod' ? '#3b82f6' : '#e5e7eb' }}>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">Cash on Delivery</span>
                                    </label>
                                    {paymentMethod === 'cod' && (
                                        <p className="mt-2 text-sm text-gray-600 ml-7">
                                            Pay with cash when your order is delivered
                                        </p>
                                    )}
                                </div>

                                {/* Credit/Debit Card */}
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
                                    onClick={() => setPaymentMethod('card')}
                                    style={{ borderColor: paymentMethod === 'card' ? '#3b82f6' : '#e5e7eb' }}>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">Credit/Debit Card</span>
                                    </label>
                                    {paymentMethod === 'card' && (
                                        <div className="mt-4 ml-7 space-y-3">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    placeholder="Card Number"
                                                    value={cardDetails.cardNumber}
                                                    onChange={handleCardChange}
                                                    maxLength="19"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    placeholder="Cardholder Name"
                                                    value={cardDetails.cardName}
                                                    onChange={handleCardChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={cardDetails.expiryDate}
                                                    onChange={handleCardChange}
                                                    maxLength="5"
                                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    placeholder="CVV"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardChange}
                                                    maxLength="3"
                                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* UPI */}
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
                                    onClick={() => setPaymentMethod('upi')}
                                    style={{ borderColor: paymentMethod === 'upi' ? '#3b82f6' : '#e5e7eb' }}>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={paymentMethod === 'upi'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">UPI Payment</span>
                                    </label>
                                    {paymentMethod === 'upi' && (
                                        <div className="mt-4 ml-7">
                                            <input
                                                type="text"
                                                placeholder="Enter UPI ID (e.g., username@upi)"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Net Banking */}
                                <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
                                    onClick={() => setPaymentMethod('netbanking')}
                                    style={{ borderColor: paymentMethod === 'netbanking' ? '#3b82f6' : '#e5e7eb' }}>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="netbanking"
                                            checked={paymentMethod === 'netbanking'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">Net Banking</span>
                                    </label>
                                    {paymentMethod === 'netbanking' && (
                                        <p className="mt-2 text-sm text-gray-600 ml-7">
                                            You will be redirected to your bank's website
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                            
                            <div className="space-y-3 mb-4">
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {cart?.map((item) => (
                                        <div key={item._id} className="flex gap-2 text-sm">
                                            <img 
                                                src={item.image || 'https://via.placeholder.com/50'} 
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold">₹{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-semibold">₹40.00</span>
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
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className={`w-full py-3 rounded-lg font-semibold transition ${
                                    isProcessing 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </button>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    ← Back to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
