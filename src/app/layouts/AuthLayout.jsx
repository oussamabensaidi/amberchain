import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AuthLayout({ children, title = 'BOMBYX' }) {
  useDocumentTitle(title);

  return (
    <div className="auth-layout bg-accent/70 min-h-screen">
      <Navbar type='auth' />
      {children || <Outlet />}
    </div>
  );
}