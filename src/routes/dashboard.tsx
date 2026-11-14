import { useEffect } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";

// TanStack Router route definition
export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin" as any });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg">Redirecting to the admin page…</p>
    </div>
  );
}
