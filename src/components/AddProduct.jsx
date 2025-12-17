import { useState } from "react";

const ProductForm = ({ onAddProduct }) => {
    const [productName, setProductName] = useState("");
    const handleNameChange = (e) => {
        setProductName(e.target.value);
    }
    const [ImageURL, setImageURL] = useState("");
    const handleURLChange = (e) => {
        setImageURL(e.target.value);
    }
    const [sellingPrice, setSellingPrice] = useState("");
    const handlePriceChange = (e) => {
        setSellingPrice(e.target.value);
    }
    const [originalPrice, setOriginalPrice] = useState("");
    const handleOriginalPriceChange = (e) => {
        setOriginalPrice(e.target.value);
    }
    const [description, setDescription] = useState("");
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }
    const [category, setCategory] = useState("Electronics");
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!productName || !sellingPrice) {
            return;
        }

        const productData = {
            id: Date.now(),
            name: productName,
            image: ImageURL,
            sellingPrice: parseFloat(sellingPrice),
            originalPrice: parseFloat(originalPrice),
            description: description,
            category
        };

        onAddProduct(productData);
        setProductName("");
        setImageURL("");
        setSellingPrice("");
        setOriginalPrice("");
        setDescription("");
        setCategory("Electronics");
    }
    return (
        <div className="w-[600px] mx-auto p-5 flex flex-col gap-4 bg-green-50 rounded-md mt-10 ">
            <h1 className="text-3xl mx-auto mb-4">Add Products</h1>
            <label className="text-lg font-medium">Product Name</label>
            <input type="text"
                placeholder="Enter Product Name"
                className="p-2 rounded-md "
                value={productName}
                onChange={handleNameChange} />
            <label className="text-lg font-medium">Image Url</label>
            <input type="text"
                placeholder="Enter Image Url"
                className="p-2 rounded-md "
                value={ImageURL}
                onChange={handleURLChange} />
            <label className="text-lg font-medium">Selling Price</label>
            <input type="number"
                placeholder="Enter Selling Price"
                className="p-2 rounded-md "
                value={sellingPrice}
                onChange={handlePriceChange} />
            <label className="text-lg font-medium">Original Price</label>
            <input type="number"
                placeholder="Enter Original Price"
                className="p-2 rounded-md "
                value={originalPrice}
                onChange={handleOriginalPriceChange} />
            <label className="text-lg font-medium">Description</label>
            <textarea
                placeholder="Enter Product Description"
                className="p-2 rounded-md "
                value={description}
                onChange={handleDescriptionChange}
                rows="3" />
            <label className="text-lg font-medium">Category</label>
            <select className="p-2 rounded-md " value={category} onChange={handleCategoryChange}>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Computers">Computers</option>
                <option value="Gaming">Gaming</option>
                <option value="Audio">Audio</option>
                <option value="Mobile">Mobile</option>
                <option value="Wearables">Wearables</option>
                <option value="Home">Home</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600" onClick={handleSubmit}>Submit</button>
        </div>
    )
}
export default ProductForm