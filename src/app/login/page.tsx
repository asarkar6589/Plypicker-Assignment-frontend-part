'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUserContext } from '../layout';

const LoginForm = () => {
    const { user, setUser } = useUserContext();
    const [disable, setDisable] = useState<boolean>(false);
    const router = useRouter();

    async function handelFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        const userData = {
            email,
            password
        };

        try {
            setDisable(true);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            if (res?.data.success) {
                toast.success(res.data?.message);
                setUser(res.data.user);
                router.push('/');
            } else {
                toast.error(res.data?.message);
            }

            setDisable(false);
        } catch (err: any) {
            if (err.response) {
                toast.error(`Error ${err.response.status}: ${err.response.data.message}`);
                console.error('Error response:', err.response.data);
            } else if (err.request) {
                toast.error('No response from the server');
                console.error('Error request:', err.request);
            } else {
                toast.error('Error setting up request');
                console.error('Error message:', err.message);
            }
            setDisable(false);
        }
    }

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    if (user) {
        return null;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 text-center">Login</h1>
                <form onSubmit={handelFormSubmit} method="post" className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="email"
                            id="Email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            id="Password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        disabled={disable}
                    >
                        {
                            disable ? <span>Please Wait...</span> : <span>Login</span>
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
