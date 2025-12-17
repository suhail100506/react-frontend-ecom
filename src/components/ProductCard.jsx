const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
            />

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-800">₹{product.price}</span>

                    <button
                        onClick={() => onAddToCart(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
