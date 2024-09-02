'use client';

import Loader from '@/components/Loader';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUserContext } from '../context/UserContext';

export interface Request {
    _id: string;
    user: string;
    product: string;
    status: "Pending" | "Approved" | "Rejected";
    changes: {
        name?: string;
        description?: string;
        photo?: string;
        price?: number;
    };
}

const PendingRequestsPage = () => {
    const { user } = useUserContext();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== "Admin") {
            redirect('/login');
        } else {
            const fetchRequests = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/all`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });
                    setRequests(response.data.requests);
                } catch (error) {
                    console.error("Error fetching requests:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRequests();
        }
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Pending Requests</h1>
            {
                requests ? (
                    <div>
                        {requests.length === 0 ? (
                            <p className="text-center text-gray-600">No pending requests.</p>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {requests.map((request) => (
                                    <Link href={`/pending-request/${request._id}`} key={request._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:bg-gray-100 transition">
                                        <div className="block flex-grow">
                                            <div className="mt-auto">
                                                <p className="text-gray-600">
                                                    <span className="font-semibold">Request Id:</span> {request._id}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-semibold">User:</span> {request.user}
                                                </p>
                                            </div>
                                        </div>

                                        <p className={`text-sm font-bold mt-4 ${request.status === "Pending" ? "text-yellow-500" : request.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                                            Status: {request.status}
                                        </p>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <div>
                        <Loader />
                    </div>
                )
            }
        </div>
    );
}

export default PendingRequestsPage;
