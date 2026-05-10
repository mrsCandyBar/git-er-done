'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { userStore } from "@/stores";
import Button from './Button';
import { useRouter } from "next/navigation";

type GoogleCredentialResponse = {
  credential: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id?: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: 'outline' | 'filled_blue' | 'filled_black'; size: 'large' | 'medium' | 'small' }
          ) => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton() {
  const router = useRouter();

  useEffect(() => {
    if (!window.google) return;

    const googleSignInDiv = document.getElementById('googleSignInDiv');
    if (!googleSignInDiv) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(googleSignInDiv, {
      theme: 'outline',
      size: 'large',
    });  
  }, []);

  async function handleCredentialResponse(response: GoogleCredentialResponse) {
    const idToken = response.credential;
    let data = userStore.loginWithGoogle(idToken).then(() => {
      router.push("/profile");

    }).catch(error => {
      console.error("Login failed:", error);
    });

    console.log(data);
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div id="googleSignInDiv" />
    </>
  );
}