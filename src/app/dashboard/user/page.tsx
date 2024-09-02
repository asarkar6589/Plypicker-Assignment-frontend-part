import ProductCardComponent from '@/components/ProductCardComponent';

const fetchProducts = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/all`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.products;
    } catch (error: any) {
        console.error("Error fetching products:", error);
        return [];
    }
};


const UserDashBoard = async () => {
    const products = await fetchProducts();

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {

                products.length > 0 ? (
                    products.map((product: any) => (
                        <ProductCardComponent
                            id={product._id}
                            key={product._id}
                            image={product.image}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                        />
                    ))
                ) : (
                    <p>No products found.</p>
                )

            }
        </div>
    );
};

export default UserDashBoard;
