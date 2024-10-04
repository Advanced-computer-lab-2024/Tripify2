"use client"
import { useParams } from "next/navigation";

export default function ViewPlace(){
    const params = useParams()
 
    return (
        <div>
            {
                params.id
            }
        </div>
    );
}