"use client";
import Dashboard from "@/components/ui/dashboard";

import { useRouter } from "next/navigation";

export default function MyAdvertiser() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleActivitiesClick = () => {
    router.push("/my-activities");
  };

  return (
    <div>
      <header>
        <Dashboard params={{ role: "Advertiser" }} />
      </header>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-3xl font-bold">Welcome to MyAdvertiser</h1>
        <div className="flex flex-col gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleProfileClick}
          >
            View My Profile
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={handleActivitiesClick}
          >
            My Activities
          </button>
        </div>
      </div>
    </div>
  );
}
