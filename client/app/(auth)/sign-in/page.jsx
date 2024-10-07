import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SignIn from "./sign-in";

export default async function SignUpPage() 
{
    const session = await getSession();

    if(session?.user) return redirect('/')

    return <SignIn />
    
}