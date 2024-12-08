"use client";
import { useState } from "react";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/InputForm";
import { Callout } from "@/components/ui/Callout";

const Page = () => {
  const session = useSession();

  const router = useRouter();

  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createTag = async () => {
    try {
      setLoading(true);

      const response = await fetcher("/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Tag: newTag,
          UserId: session?.data?.user?.userId,
        }),
      });

      const data = await response.json();

      setSuccess(true);

      setTags([...tags, data]);
      setNewTag("");
      router.push("/my-tags");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="font-poppins px-8 md:px-24 items-center justify-center w-full flex flex-col h-screen gap-12">
      <h1 className="text-3xl font-semibold">Create Tag</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTag();
        }}
        className="space-y-6 max-w-[370px] w-full flex items-center justify-center flex-col bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="flex flex-col gap-2 w-full">
          <Input
            disabled={loading}
            type="text"
            placeholder="New Tag (e.g., Monuments, Museums)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <Button
          disabled={!newTag || loading}
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Create Tag
        </Button>

        {error && (
          <Callout variant="error" title="Something went wrong">
            {error}
          </Callout>
        )}
        {success && (
          <Callout variant="success" title="Tag created successfully">
            Redirecting to the home page...
          </Callout>
        )}
      </form>
    </section>
  );

  //   return (
  //     <div className="max-w-md mx-auto p-6 bg-white space-y-8 mb-8">
  //       <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a Tag</h2>
  //       <input
  //         type="text"
  //         placeholder="New Tag (e.g., Monuments, Museums)"
  //         value={newTag}
  //         onChange={(e) => setNewTag(e.target.value)}
  //         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
  //       />
  //       <Button
  //         onClick={createTag}
  //         className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mt-4"
  //       >
  //         Create Tag
  //       </Button>
  //     </div>
  //   );
};

export default Page;
