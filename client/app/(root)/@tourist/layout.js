// @tourist/layout.js
import Dashboard from "@/components/ui/dashboard";
import { getSession } from "@/lib/session";

export default async function TouristLayout({ children }) {
  const Session = await getSession();

  return (
    <html lang="en">
      <body>
        <header>
          <Dashboard
            params={{
              role: "Tourist",
              /*id: "67001e91b4ba61e78487b585"*/ id: Session.user.id,
            }}
          />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
