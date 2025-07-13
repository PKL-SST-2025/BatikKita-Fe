import { useAuth } from "../store/AuthContext";
import { Navigate } from "@solidjs/router";
import type { JSX } from "solid-js";

export default function AdminRoute(props: { children: JSX.Element }): JSX.Element {
  const { user } = useAuth();
  const currentUser = user();

  if (!currentUser) return <Navigate href="/login" />;
  if (currentUser.role !== "admin") return <Navigate href="/" />;

  return props.children;
}