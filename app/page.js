'use client'
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const handleDashboard = () =>{
    router.push('/dashboard');
  }

  return (
    <div className="p-1">
      <button onClick={handleDashboard} className="border p-1 rounded-md hover:cursor-pointer">Dashboard Page</button>
    </div>
  );
}
