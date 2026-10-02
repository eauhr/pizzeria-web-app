import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-16">
        {import.meta.env.VITE_DEMO_MODE === "true" && (
          <aside className="bg-secondary px-4 py-2 text-center text-xs font-semibold text-secondary-foreground" role="status">
            Portfolio demo: use any sign-in details and verification code 123456. Accounts, checkout and reservation actions are simulated; nothing is sent.
          </aside>
        )}
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
