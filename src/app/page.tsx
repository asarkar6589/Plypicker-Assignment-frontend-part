'use client';
import { useUserContext } from "./layout";

const Page = () => {
  const { user } = useUserContext();

  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
        <p className="mt-4 text-lg text-gray-700">
          This is the homepage. Use the navigation links above to navigate to different pages.
        </p>
      </main>
    </div>
  )
}

export default Page;
