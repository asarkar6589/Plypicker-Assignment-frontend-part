'use client';
import Loader from '@/components/Loader';
import StatsTable from '@/components/StatsTable';
import axios from 'axios';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUserContext } from '../context/UserContext';

interface CountOfRequestsForUser {
    approvedRequest: number;
    pendingRequest: number;
    rejectedRequest: number;
    totalRequest: number;
}

const ProfilePage = () => {
    const { user, setUser } = useUserContext();
    const [disable, setDisable] = useState<boolean>(false);
    const [numberOfRequests, setNumberOfRequests] = useState<CountOfRequestsForUser | null>(null);
    const [numberOfRequestsForAdmin, setNumberOfRequestsForAdmin] = useState<CountOfRequestsForUser | null>(null);
    const router = useRouter();

    const logoutHandeler = async () => {
        try {
            setDisable(true);

            const apiResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (apiResponse.data.success) {
                console.log(apiResponse.data);
                setUser(null);
                toast.success(apiResponse.data.message);
                router.replace('/');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        setDisable(false);
    }

    const fetchDataForUser = async () => {
        try {
            const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/user/count`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (apiResponse.data.success) {
                setNumberOfRequests(apiResponse.data);
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const fetchDataForAdmin = async () => {
        try {
            const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change/admin/count`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (apiResponse.data.success) {
                setNumberOfRequestsForAdmin(apiResponse.data);
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!user) {
            redirect('/');
        }

        if (user.role === "Admin") {
            fetchDataForAdmin();
        }
        else {
            fetchDataForUser();
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-7 items-center mt-12 h-screen bg-gray-50">
            {user ? (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Welcome {user.email}!</h1>

                    {
                        user && user.role === 'User' && numberOfRequests ? (
                            <StatsTable
                                approvedRequest={numberOfRequests?.approvedRequest}
                                pendingRequest={numberOfRequests?.pendingRequest}
                                rejectedRequest={numberOfRequests?.rejectedRequest}
                                totalRequest={numberOfRequests?.totalRequest}
                            />
                        ) : (
                            <span></span>
                        )
                    }

                    {
                        user && user.role === 'Admin' && numberOfRequestsForAdmin ? (
                            <StatsTable
                                approvedRequest={numberOfRequestsForAdmin?.approvedRequest}
                                pendingRequest={numberOfRequestsForAdmin?.pendingRequest}
                                rejectedRequest={numberOfRequestsForAdmin?.rejectedRequest}
                                totalRequest={numberOfRequestsForAdmin?.totalRequest}
                            />
                        ) : (
                            <span></span>
                        )
                    }

                    <div className='flex gap-12 justify-center'>
                        {
                            user && user.role === "User" && <Link href="/profile/my-submissions" className="mt-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
                                My Requests
                            </Link>
                        }
                        {user && user.role === "Admin" && (
                            <Link
                                href="/pending-request"
                                className="mt-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                            >
                                Pending Request
                            </Link>
                        )}

                        <button className="mt-4 py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300" onClick={logoutHandeler} disabled={disable}>
                            {
                                disable ? <span>Please Wait ...</span> : <span>Logout</span>
                            }
                        </button>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
};

export default ProfilePage;
