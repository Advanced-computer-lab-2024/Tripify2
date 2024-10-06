// @tourist/layout.js
import Dashboard from "@/components/ui/dashboard";

export default async function GuestLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Dashboard
            params={{
              role: "Guest",
              /*id: "67001e91b4ba61e78487b585"*/ id: "",
            }}
          />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
