'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { userStore } from "@/stores";
import { useRouter } from "next/navigation";
import Button from './Button';

const SHOULD_USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_DUMMY_DATA === "true";

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

    if (SHOULD_USE_DUMMY_DATA) {
      console.log("Using dummy data mode - Google login will return a simulated user profile.");
      return;
    }

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
      console.log("Login successful, navigating to profile page...", data);
      router.push("/profile");

    }).catch(error => {
      console.error("Login failed:", error);
    });
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <Button onClick={() => handleCredentialResponse({ credential: 'test' })}>Login with Google</Button>
      
      <div id="googleSignInDiv" />
    </>
  );
}