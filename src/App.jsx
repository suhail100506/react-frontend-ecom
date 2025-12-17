import { useState, createContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import axios from 'axios';

export const AppContext = createContext();

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Set user data from sessionStorage if available
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
        if (username && role) {
          setUser({ username, role });
        }

        // Fetch cart after setting token
        try {
          const cartResponse = await axios.get('https://react-backend-ecom.onrender.com/carts');
          const cartData = cartResponse.data.cart;

          const transformedCart = cartData?.products?.map(item => ({
            _id: item._id,
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity
          })) || [];

          setCart(transformedCart);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart([]);
        }
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('https://react-backend-ecom.onrender.com/products');
        const data = response.data;
        setProducts(data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const addProduct = async (newProduct) => {
    try {
      await axios.post('https://react-backend-ecom.onrender.com/products', {
        name: newProduct.name,
        image: newProduct.image || "",
        price: parseFloat(newProduct.sellingPrice),
        originalPrice: parseFloat(newProduct.originalPrice) || 0,
        description: newProduct.description || "",
        category: newProduct.category || "Other",
        stock: parseInt(newProduct.stock) || 0
      });

      const productsResponse = await axios.get('https://react-backend-ecom.onrender.com/products');
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await axios.post('https://react-backend-ecom.onrender.com/carts', {
        productId: product._id || product.id,
        quantity: 1
      });

      const cartData = response.data.cart;
      const transformedCart = cartData?.products?.map(item => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity
      })) || [];

      setCart(transformedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const existingItem = cart.find(item => item.productId === (product._id || product.id));
      if (existingItem) {
        setCart(cart.map(item =>
          item.productId === (product._id || product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { ...product, productId: product._id || product.id, quantity: 1 }]);
      }
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      try {
        const response = await axios.put(`https://react-backend-ecom.onrender.com/carts/${cartItemId}`, {
          quantity: newQuantity
        });

        const cartData = response.data.cart;
        const transformedCart = cartData?.products?.map(item => ({
          _id: item._id,
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        })) || [];

        setCart(transformedCart);
      } catch (error) {
        console.error('Error updating quantity:', error);
        setCart(cart.map(item =>
          item._id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      }
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await axios.delete(`https://react-backend-ecom.onrender.com/carts/${cartItemId}`);

      const cartData = response.data.cart;
      const transformedCart = cartData?.products?.map(item => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity
      })) || [];

      setCart(transformedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setCart(cart.filter(item => item._id !== cartItemId));
    }
  };

  const refreshCart = async () => {
    try {
      const cartResponse = await axios.get('https://react-backend-ecom.onrender.com/carts');
      const cartData = cartResponse.data.cart;

      const transformedCart = cartData?.products?.map(item => ({
        _id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity
      })) || [];

      setCart(transformedCart);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      setCart([]);
    }
  };

  const cartCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('username');
    setUser(null);
    setProducts([]);
    setCart([]);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AppContext.Provider value={{ products, cart, user, setUser, addProduct, addToCart, updateQuantity, removeFromCart, refreshCart, logout }}>
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cartCount} />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AppContext.Provider>
  )
}
export default App