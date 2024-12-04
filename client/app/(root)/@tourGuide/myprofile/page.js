import Tourguideprofile from "@/components/ui/Tourguideprofile.jsx";
import { getSession } from "@/lib/session";
import { fetcher } from "@/lib/fetch-client";
export default async function MyProfile() {
  const Session = await getSession();
  const id = Session.user.id;
  const role = Session.user.role;

  const res = await fetcher(`/tourguides/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tour guide data");
  }

  const tourguide = await res.json();

  //   console.log("-----------------------");
  //   console.log(tourguide);
  //   console.log("-----------------------");

  return (
    <div>
      <Tourguideprofile
        tourguide={tourguide.tourguide}
        tourguideid={id}
        role={role}
      />
    </div>
  );
}
