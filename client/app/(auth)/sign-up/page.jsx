import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SignUp from "./sign-up";

export default async function SignUpPage() 
{
    const session = await getSession();

    if(session?.user) return redirect('/')

    return <SignUp />
    
}