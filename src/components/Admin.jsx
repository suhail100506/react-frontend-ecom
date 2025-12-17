import { useContext, useState } from 'react';
import { AppContext } from '../App';
import AddProduct from './AddProduct';
import axios from 'axios';
import { toast } from 'react-toastify';

const Admin = () => {
    const { addProduct, products } = useContext(AppContext);
    const username = sessionStorage.getItem('username') || 'Admin';
    const [editingProduct, setEditingProduct] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [newOriginalPrice, setNewOriginalPrice] = useState('');

    const handleEditPrice = (product) => {
        setEditingProduct(product);
        setNewPrice(product.price);
        setNewOriginalPrice(product.originalPrice || product.price);
    };

    const handleUpdatePrice = async () => {
        try {
            await axios.put(`https://react-backend-ecom.onrender.com/products/${editingProduct._id}`, {
                ...editingProduct,
                price: parseFloat(newPrice),
                originalPrice: parseFloat(newOriginalPrice)
            });

            toast.success('Product price updated successfully!');
            setEditingProduct(null);
            setNewPrice('');
            setNewOriginalPrice('');

            // Refresh the page to show updated prices
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update price');
            console.error(error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`https://react-backend-ecom.onrender.com/products/${productId}`);
                toast.success('Product deleted successfully!');
                window.location.reload();
            } catch (error) {
                toast.error('Failed to delete product');
                console.error(error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome, {username}! Manage your products here.</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
                    <AddProduct onAddProduct={addProduct} />
                </div>

                {/* Products List with Edit Prices */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Products & Prices</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products && products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover mr-3" />
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.originalPrice || product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditPrice(product)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit Price
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No products available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Price Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Product Price</h3>
                            <p className="text-sm text-gray-600 mb-4">Product: {editingProduct.name}</p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Original Price ($)
                                </label>
                                <input
                                    type="number"
                                    value={newOriginalPrice}
                                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selling Price ($)
                                </label>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setNewPrice('');
                                        setNewOriginalPrice('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdatePrice}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Update Price
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;