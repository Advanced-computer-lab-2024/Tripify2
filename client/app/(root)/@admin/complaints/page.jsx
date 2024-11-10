import { fetcher } from "@/lib/fetch-client";
import Complaints from "./complaints";

export default async function CompaintsPage()
{
    const complaints = await fetcher('/complaints');

    if (!complaints.ok) 
    {
        return <div>Error fetching complaints</div>;
    }

    const data = await complaints.json();

    return <Complaints initialComplaints={data} />;
}