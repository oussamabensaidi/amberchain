import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import storage from '@/lib/storage';


const fetchCurrentUser = async () => {
  // Only fetch when a token is present in session storage.
  // This avoids auto-authenticating users when no token exists (e.g., after logout).
  const token = storage.getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_DOMAIN}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Fetched current user:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export default function useCurrentUserQuery() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
