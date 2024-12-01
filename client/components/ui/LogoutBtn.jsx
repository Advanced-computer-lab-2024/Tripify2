"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const router = useRouter();
  const session = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    router.push("/");
  };

  //console.log(session)

  if (!session?.data?.user) return null;

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
