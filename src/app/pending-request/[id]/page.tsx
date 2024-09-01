'use client';
import { useUserContext } from '@/app/layout';
import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Request } from '../page';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Product } from '@/app/dashboard/admin/product/[id]/page';

interface Params {
    id: string;
}
const Page = ({ params }: { params: Params }) => {
    const id = params.id;
    const { user } = useUserContext();
    const router = useRouter();
    const [request, setRequest] = useState<Request | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [status, setStatus] = useState<string>("");

    // Fetch the request details
    const fetchDataOfASingleRequest = async () => {
        try {
            const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/${id}`, {
                withCredentials: true
            });

            if (apiResponse.data.request) {
                setRequest(apiResponse.data.request);
            } else {
                toast.error("No request found");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Fetch the product details once the request is available
    const fetchProduct = async (productId: string) => {
        try {
            const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/get/${productId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setProduct(apiResponse.data.product);
        } catch (error: any) {
            console.error("Error fetching product:", error);
            toast.error("Failed to fetch product details");
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(status);

        try {
            const apiResponse = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/update/${id}`, {
                status
            }, {
                withCredentials: true
            });

            if (apiResponse.data.success) {
                toast.success(apiResponse.data.message);
                router.push('/pending-request');
            }
        } catch (error: any) {
            toast.error(error.message);
            return;
        }
    }

    useEffect(() => {
        if (!user || user.role !== "Admin") {
            router.push('/');
        }
    }, [user, router]);

    useEffect(() => {
        fetchDataOfASingleRequest();
    }, [id]);

    useEffect(() => {
        if (request && request.product) {
            fetchProduct(request.product);
        }
    }, [request]);

    return (
        <div className="p-6 mt-12 ">
            {request ? (
                <div>
                    <h1 className="text-2xl font-semibold mb-4">Request Details</h1>
                    <p className="mb-2">Id: {request._id}</p>
                    <p className="mb-4">User: {request.user}</p>

                    <h1 className="text-xl font-semibold mb-4">Comparison of Changes</h1>
                    {product && (
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-300 text-left rounded-xl">Original</th>
                                    <th className="py-2 px-4 border-b border-gray-300 text-left">Changed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {request.changes.name && (
                                    <tr>
                                        <td className="py-2 px-4 border-b border-gray-300">{product.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{request.changes.name}</td>
                                    </tr>
                                )}
                                {request.changes.description && (
                                    <tr>
                                        <td className="py-2 px-4 border-b border-gray-300">{product.description}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">{request.changes.description}</td>
                                    </tr>
                                )}
                                {request.changes.price && (
                                    <tr>
                                        <td className="py-2 px-4 border-b border-gray-300">₹{product.price}</td>
                                        <td className="py-2 px-4 border-b border-gray-300">₹{request.changes.price}</td>
                                    </tr>
                                )}
                                {request.changes.photo && (
                                    <tr>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            <img src={product.image} alt={product.name} className="h-20 w-20 object-cover" />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-300">
                                            <img src={request.changes.photo} alt={request.changes.name} className="h-20 w-20 object-cover" />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    <form className="mt-6" onSubmit={submitHandler}>
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="status"
                                value="Approved"
                                className="mr-2"
                                onChange={e => setStatus(e.target.value)}
                            />
                            Approve
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="Rejected"
                                className="mr-2"
                                onChange={e => setStatus(e.target.value)}
                            />
                            Reject
                        </label>
                        <button className="ml-6 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600" type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <span>No Request Found</span>
            )}
        </div>

    );
}

export default Page;

