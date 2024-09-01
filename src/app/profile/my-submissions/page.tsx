'use client';

import { useUserContext } from "@/app/context/UserContext";
import { Request } from "@/app/pending-request/page";
import Loader from "@/components/Loader";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MySumbission = () => {
    const { user } = useUserContext();
    const [requests, setRequests] = useState<Request[]>([]);

    const fetchData = async () => {
        try {
            const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/user/all`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            setRequests(apiResponse.data.requests);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!user || user.role === "Admin") {
            redirect('/');
        }
        else {
            fetchData();
        }
    }, [user]);

    return (
        <div className="p-6 mt-12 bg-white rounded-lg">
            <h1 className="text-center text-2xl mb-5 font-extrabold">My Submissions</h1>
            {
                requests ? (
                    <div>
                        {
                            requests.length > 0 ? (
                                <div>
                                    <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Request Id</th>
                                                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Product Id</th>
                                                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((request) => (
                                                <tr key={request._id} className="hover:bg-gray-100 transition duration-300">
                                                    <td className="py-2 px-4 border-b border-gray-300">{request._id}</td>
                                                    <td className="py-2 px-4 border-b border-gray-300">{request.product}</td>
                                                    <td className={`py-2 px-4 border-b border-gray-300 ${request.status === "Pending" ? 'text-yellow-500' : request.status === "Approved" ? 'text-green-500' : 'text-red-500'}`}>
                                                        {request.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500">No requests found.</p>
                            )
                        }
                    </div>
                ) : (
                    <div>
                        <Loader />
                    </div>
                )
            }
        </div>

    )
}

export default MySumbission;
