import PageLoader from "@/components/PageisLoading";
import useCurrentUserQuery from "@/queries/useCurrentUserQuery";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRedirect() {
  const navigate = useNavigate();
  const { user, isLoading, setAuth, token } = useAuthStore();
  const { data, isLoading: isQueryLoading, isFetched } = useCurrentUserQuery();

  useEffect(() => {
    if (!isQueryLoading && data) {
      setAuth(data, token);
    }
  }, [isQueryLoading, data, setAuth, token]);

  useEffect(() => {
    if (isLoading || !isFetched) return;
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/auth/login", { replace: true });
    }
  }, [user, isLoading, isFetched, navigate]);

  if (isQueryLoading) return <PageLoader />;
  return null;
}