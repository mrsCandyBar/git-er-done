'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { userStore } from "@/stores";
import Button from './Button';

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

  function fakeClick() {
    handleCredentialResponse({credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5Y2FhZWNkZThmNDg1ZThmNTkzOGY0OGFiYTBjZTdhMzU4MWYwMjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5ODEwNTU4NTE4NDctOGRwZzJmdW01bDk3MnBvZHBrdDIwZmRyNm04NGNuanQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5ODEwNTU4NTE4NDctOGRwZzJmdW01bDk3MnBvZHBrdDIwZmRyNm04NGNuanQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcyOTA5NTUyODMyNzA2MDk3NTkiLCJlbWFpbCI6ImNhbmRpY2VrYmFyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3Nzc4ODQ3NzYsIm5hbWUiOiJDYW5kaWNlIEJhciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLa2ZlUEJpUWRmVkVjUjVOVjVOZk5oT0FFeDkxcXZRdHlpYk8wTklUZzYteWMtNExQUj1zOTYtYyIsImdpdmVuX25hbWUiOiJDYW5kaWNlIiwiZmFtaWx5X25hbWUiOiJCYXIiLCJpYXQiOjE3Nzc4ODUwNzYsImV4cCI6MTc3Nzg4ODY3NiwianRpIjoiMjYxMjdlZDIyMmM1YzA4OTExODQwODhiOTA2ZWY1NWVjYjJlZjkxNCJ9.mTCacT3BN6K0bTL9CqwzBHLoZA3V_mWMYWiCQRrLBLqsOM_7XZRkC35pllmnxyXODDoDVhCoLu2j3UaWAW8UY9xynJozwb_NdCygaQmLyPaVGsxcDGbGuaENiLNGaBBGD8jKRjSCD2MH3_LO2n29kvsDCQobxez4a9clSsgKvbDpJLZ5P3Zn6ygo5MC4QKJ8Di5_EdHGcRbNuULOuE8suu1SHNDxuyg6q1wpHVDSdQDJCUke7IUMaH0WO8XM3T_frDYgKimjFOvMATi8uOwn4AtEpT4UzCpNJZsYBWiVmGd8_iYGmvb6t5SiVsm2t5Btrj4GMuyunpDjYigzZD-gnA"});
  }

  async function handleCredentialResponse(response: GoogleCredentialResponse) {
    const idToken = response.credential;
    let data = userStore.loginWithGoogle(idToken).then(user => {
      console.log("Logged in user:", user);
    }).catch(error => {
      console.error("Login failed:", error);
    });

    console.log(data);
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <Button onClick={fakeClick} variant="outline">
        Sign in with Google
      </Button>

      <div id="googleSignInDiv" />
    </>
  );
}