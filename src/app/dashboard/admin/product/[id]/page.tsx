'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Params {
    id: string;
}

export interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
}

const ProductPage = ({ params }: { params: Params }) => {
    const id = params.id;
    const router = useRouter();
    const [disable, setDisable] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);

    const fetchProduct = async () => {
        try {
            const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setProduct(apiResponse.data.product);
        } catch (error: any) {
            console.error("Error fetching product:", error);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const photo = formData.get('photo') as File;

        const formdata = new FormData();
        formdata.append('name', String(name));
        formdata.append('description', String(description));
        formdata.append('price', String(price));
        if (photo) {
            formdata.append('photo', photo);
        }

        try {
            setDisable(true);

            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            // Show success toast message
            toast.success(response.data.message || "Product updated successfully!");

            // Redirect to /dashboard/admin
            router.push('/dashboard/admin');
            router.refresh(); // to show the updated data in the server component.
        } catch (error: any) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || "Failed to update product.");
        }
        setDisable(false);
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            {product ? (
                <div className="bg-white shadow-lg rounded-lg p-8 flex">
                    {/* Left Side - Product Image */}
                    <div className="w-1/2 p-4">
                        <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg" />
                    </div>

                    {/* Right Side - Product Form */}
                    <div className="w-1/2 p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={product.name}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                                    Product Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={product.description}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows={4}
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">
                                    Product Price (₹)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    defaultValue={product.price}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
                                    Upload Product Image
                                </label>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
                                    disabled={disable}
                                >
                                    {
                                        disable ? <span>Please Wait..</span> : <span>Update Product</span>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <p>Loading product...</p>
            )}
        </div>
    );
};

export default ProductPage;
