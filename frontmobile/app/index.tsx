import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import SplashScreen from '@/component/SplashScreen';


export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home'); // Redirection vers la page home
    }, 2000); // délai de 2s

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
