import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  firebaseUnavailableMessage,
  isFirebaseConfigured,
} from "../firebase/firebase";
import { useNavigate } from "@tanstack/react-router";


export default function ProtectedRoute({ children }: any) {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate({ to: "/admin" as any });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6">
          <h2 className="text-xl font-semibold">Access is unavailable</h2>
          <p className="mt-2 text-sm text-amber-200">{firebaseUnavailableMessage}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return children;
}