'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(protectedRoute) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/check', {
          method: 'GET',
          credentials: 'include', 
        });

        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          if (protectedRoute) router.push('/Auth/Login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthenticated(false);
        if (protectedRoute) router.push('/Auth/Login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [protectedRoute, router]);

  return { loading, authenticated };
}
