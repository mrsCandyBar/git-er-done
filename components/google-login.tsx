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

  function fakeClick() {
    handleCredentialResponse({credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwNzZkZGJhYjQxNTU1NmUxNjkxNTRjNmE0YTBiZGJkNDQ2OWI3OWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5ODEwNTU4NTE4NDctOGRwZzJmdW01bDk3MnBvZHBrdDIwZmRyNm04NGNuanQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5ODEwNTU4NTE4NDctOGRwZzJmdW01bDk3MnBvZHBrdDIwZmRyNm04NGNuanQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcyOTA5NTUyODMyNzA2MDk3NTkiLCJlbWFpbCI6ImNhbmRpY2VrYmFyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3Nzc4OTYyNTQsIm5hbWUiOiJDYW5kaWNlIEJhciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLa2ZlUEJpUWRmVkVjUjVOVjVOZk5oT0FFeDkxcXZRdHlpYk8wTklUZzYteWMtNExQUj1zOTYtYyIsImdpdmVuX25hbWUiOiJDYW5kaWNlIiwiZmFtaWx5X25hbWUiOiJCYXIiLCJpYXQiOjE3Nzc4OTY1NTQsImV4cCI6MTc3NzkwMDE1NCwianRpIjoiYjJlMjI2NjNmMzMyZWY2OGU0YzE2NmQ2OGM0OTVjYzM0NWU5ZWRlOCJ9.orpK6FX-JF42mdBontx2HXaCpbQs37njJVhGkIw2kfTZoaCU0Ei3krTLH0JlRsVV7FaUD0sztJBvMZKxa6JBthlIB56_ccMphoV_CnoVSYOHeVr_4FNNz4LlK7n6iFfjdUdUQlyY12Nqvk26mLrEeDPBFUn4aAATHN3mRw-jneXufiOl6fVlIs6NtD9BU-lnQPGv8rpuk-8q_FgEmR4NQrHsnobW2aCyZG4LIP3gEyQd-PvE1K-6bymXMYXMOs0gTU8bIo11SPibhHpWCO8Skl2ZoqLG_3uYgJ4tSu7jpArru8WX6_JVO82UZBspA_B-ctMU9Fc6HmODt4S60s7gjw"});
  }

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
      <Button onClick={fakeClick} variant="outline">
        Sign in with Google
      </Button>

      <div id="googleSignInDiv" />
    </>
  );
}