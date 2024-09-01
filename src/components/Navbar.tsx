'use client';

import { useUserContext } from '@/app/context/UserContext';
import Link from 'next/link';

const Navbar = () => {
    const { user } = useUserContext();
    return (
        <nav className="bg-gray-300 shadow-lg p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                    PlyPicker
                </Link>
                <div className="space-x-4">
                    {
                        user === null ? (
                            <>
                                <Link href="/register" className="text-lg text-white hover:text-black hover:bg-white px-3 py-2 rounded-md transition-colors duration-200 border bg-gray-800">
                                    Register
                                </Link>
                                <Link href="/login" className="text-lg text-white hover:text-black hover:bg-white px-3 py-2 rounded-md transition-colors duration-200 bg-gray-800">
                                    Login
                                </Link>

                            </>
                        ) :
                            (
                                <>

                                    {
                                        user?.role === "Admin" ? (
                                            <Link href="/dashboard/admin" className="text-lg text-white hover:text-black hover:bg-white px-3 py-2 rounded-md transition-colors duration-200 bg-gray-800">
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <Link href="/dashboard/user" className="text-lg text-white hover:text-black hover:bg-white px-3 py-2 rounded-md transition-colors duration-200 bg-gray-800">
                                                Dashboard
                                            </Link>
                                        )
                                    }

                                    <Link href="/profile" className="text-lg text-white hover:text-black hover:bg-white px-3 py-2 rounded-md transition-colors duration-200 bg-gray-800">
                                        Profile
                                    </Link>

                                </>
                            )
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
