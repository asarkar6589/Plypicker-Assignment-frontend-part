'use client';

import { useUserContext } from '@/app/layout';
import Link from 'next/link';
import React from 'react';

interface ProductCardProps {
    id: string;
    image: string;
    name: string;
    description: string;
    price: number;
}

const ProductCardComponent  = ({ id, image, name, description, price }: ProductCardProps) => {
    const {user} = useUserContext();

    const link = user?.role === "Admin" ? `admin/product/${id}` : `user/product/${id}`;
    return (
        <Link href={link} className="max-w-sm bg-gray-200 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 m-4">
            <img src={image} alt={name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{name}</h2>
                <p className="text-gray-600 mb-4">{description}</p>
                <p className="text-lg font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</p>
            </div>
        </Link>
    );
};

export default ProductCardComponent;
