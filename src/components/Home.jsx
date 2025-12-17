import { useContext } from "react";
import { AppContext } from "../App";
import ProductCard from "./ProductCard";

const Home = () => {
    const { products, addToCart } = useContext(AppContext);
    const topProducts = products.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="bg-blue-600 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Techify</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Home;
