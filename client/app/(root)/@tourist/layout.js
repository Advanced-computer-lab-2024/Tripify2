// @tourist/layout.js
import Dashboard from "@/components/ui/dashboard";

export default function TouristLayout({ children }) {
  return (
    <>
      <header>
        <Dashboard
          params={{ role: "Tourist", id: "67001e91b4ba61e78487b585" }}
        />
      </header>
      <main>{children}</main>
    </>
  );
}
