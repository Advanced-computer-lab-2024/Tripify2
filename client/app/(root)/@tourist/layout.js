// @tourist/layout.js
import Dashboard from "@/components/ui/dashboard";

export default function TouristLayout({ children }) {
  return (
    <>
      <header>
        <Dashboard params={{ role: "Tourist" }} />
      </header>
      <main>{children}</main>
    </>
  );
}
