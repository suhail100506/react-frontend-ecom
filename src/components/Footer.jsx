const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Products</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Categories</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-400 transition">Track Order</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Returns</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Support</a></li>
                        </ul>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;