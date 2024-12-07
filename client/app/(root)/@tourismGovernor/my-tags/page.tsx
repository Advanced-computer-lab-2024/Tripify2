import { fetcher } from "@/lib/fetch-client";
import React from "react";

export default async function MyTagsPage() {
    const tagsRes = await fetcher("/tourism-governors/get-all/my-tags");

    if (!tagsRes.ok) {
        const tagsError = await tagsRes.json();
        console.log(tagsError);
        return <>error</>;
    }

    const tags = await tagsRes.json();

    console.log(tags)

    const cards = tags.length ? (
        tags.map((tag) => {

            return (
                <React.Fragment key={tag._id}>
                    <hr />
                    <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
                        <li className="w-full py-4 font-semibold">
                            {tag.Tag}
                        </li>
                    </ul>
                </React.Fragment>
            );
        })
    ) : (
        <p className="text-center text-gray-600">No tags created</p>
    );

    return (
        <div className="p-6">
            <div className="px-6 py-4 border-2 rounded-md border-slate-200">
                <h1 className="text-2xl">
                    <strong>My Tags</strong>
                </h1>
                <span className="text-slate-400">View your tags</span>
                <div className="mt-4">
                    <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
                        <li className="text-slate-600">Name</li>
                    </ul>
                    {cards}
                </div>
            </div>
        </div>
    )
}