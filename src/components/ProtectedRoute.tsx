import { useAuth } from "../store/AuthContext";
import { Navigate } from "@solidjs/router";
import type { JSX } from "solid-js";

export default function ProtectedRoute(props: {
  children: JSX.Element;
  requiredRole?: string;
}): JSX.Element {
  const { user } = useAuth();
  const currentUser = user();

  // Not logged in at all? Send to login
  if (!currentUser) {
    return <Navigate href="/login" />;
  }

  // Logged in, but not authorized for this route
  if (props.requiredRole && currentUser.role !== props.requiredRole) {
    return <Navigate href="/" />;
  }

  // Passed all checks → render content
  return props.children;
}