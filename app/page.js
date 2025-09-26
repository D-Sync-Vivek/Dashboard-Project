"use client";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-4xl font-bold mb-5">Welcome to My App</div>
        <div className="p-1">
          <button
            onClick={handleDashboard}
            className="border p-1 rounded-md hover:cursor-pointer"
          >
            Dashboard Page
          </button>
        </div>
      </div>
    </>
  );
}
