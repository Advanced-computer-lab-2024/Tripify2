import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ForgotPassword from "@/components/ui/ForgotPassword";

export default async function SignUpPage() 
{
    const session = await getSession();

    if(session?.user) return redirect('/')

    return <ForgotPassword />
    
}