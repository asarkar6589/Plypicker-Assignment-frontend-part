'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface User {
    _id: string;
    email: string;
    password: string;
    role: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res?.data?.sucess) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchData();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
