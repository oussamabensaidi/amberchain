import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import PageLoader from '@/components/PageisLoading';
import { getConnectedUser } from '@/services/auth';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const { user, token, setAuth, logout } = useAuthStore();
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  useEffect(() => {
    let mounted = true;
    const ensureUser = async () => {
      if (!token || user) return;
      setIsFetchingUser(true);
      try {
        const fetched = await getConnectedUser();
        if (!mounted) return;
        // If backend returns a valid user, set it in the store
        if (fetched) {
          setAuth(fetched, token);
        }
        // If fetched is null, don't logout - just wait for user state to be set
        // This prevents logout on transient network errors
      } catch (e) {
        // On error, just log and continue - don't logout on network errors
        console.error('Error fetching connected user:', e);
      } finally {
        if (mounted) setIsFetchingUser(false);
      }
    };

    ensureUser();
    return () => {
      mounted = false;
    };
  }, [token, user, setAuth, logout, navigate]);

  // No token means unauthenticated
  if (!token) return <Navigate to="/auth/login" replace />;

  // While fetching user data, show loader to avoid exposing protected UI
  if (isFetchingUser || (token && !user)) return <PageLoader />;

  // If user exists but their email isn't verified (or backend reports waiting status)
  const userStatus = user?.status || user?.userStatus || null;
  const needsEmailVerification =
    userStatus === 'WAITING_FOR_MAIL_CONFIRMATION' ||
    userStatus === 'WAITING_FOR_EMAIL_CONFIRMATION' ||
    user?.emailVerified === false ||
    user?.verified === false;

  if (needsEmailVerification) {
    // Redirect to the email verification flow
    return <Navigate to="/auth/emailVerify" replace />;
  }

  return <Outlet />;
}
