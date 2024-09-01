'use client';
import Modal from '@/components/Modal';
import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUserContext } from '@/app/layout';
import { useRouter } from 'next/navigation'

interface Params {
    id: string;
}

interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
}

const ProductPage = ({ params }: { params: Params }) => {
    const { user } = useUserContext();
    const router = useRouter();

    const id = params.id;
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [photo, setPhoto] = useState<File | null>(null);


    const updateImage = (file: File) => {
        setPhoto(file);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newFormData = new FormData();

        if (name) {
            newFormData.append('name', String(name));
        }

        if (description) {
            newFormData.append('description', String(description));
        }

        if (price) {
            newFormData.append('price', String(price));
        }

        if (photo) {
            newFormData.append('photo', photo);
        }

        try {
            setDisable(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/new/${id}`, newFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            toast.success(response.data.message || 'Changes submitted successfully!');

            router.push('/dashboard/user');
            setPhoto(null);
        } catch (error: any) {

            const errorMessage = error.response?.data?.message || 'Error submitting changes';
            toast.error(errorMessage);
            console.error('Error submitting changes:', error);
        }
        setDisable(false);
    };

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, id]);

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
            <h1 className='mb-6 text-2xl font-bold'>Submit Changes For Approval</h1>
            <div className="bg-white shadow-lg rounded-lg p-8 flex w-full">
                {/* Left Side - Product Image */}
                <div className="w-1/2 p-4">
                    {photo && (
                        <img src={URL.createObjectURL(photo)} alt="Uploaded" className="w-full h-auto rounded-lg" />
                    )}
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
                                value={name}
                                onChange={e => setName(e.target.value)}
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
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows={4}
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">
                                Product Price (₹)
                            </label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={price}
                                min={1}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
                                Upload Product Image
                            </label>
                            <button
                                type="button"
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg"
                                onClick={() => setModalOpen(true)}
                            >
                                Upload a photo
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
                                disabled={disable}
                            >
                                {
                                    disable ? <span>Please wait...</span> : <span>Submit changes for approval</span>
                                }
                            </button>
                        </div>

                        {modalOpen && <Modal updateImage={updateImage} closeModal={() => setModalOpen(false)} />}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
