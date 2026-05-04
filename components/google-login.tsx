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
    handleCredentialResponse({credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5Y2FhZWNkZThmNDg1ZThmNTkzOGY0OGFiYTBjZTdhMzU4MWYwMjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI5ODEwNTU4NTE4NDctOGRwZzJmdW01bDk3MnBvZHBrdDIwZmRyNm04NGNuanQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI5ODEwNTU4NTE4NDctOGRwZzJmdW01bDk3MnBvZHBrdDIwZmRyNm04NGNuanQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcyOTA5NTUyODMyNzA2MDk3NTkiLCJlbWFpbCI6ImNhbmRpY2VrYmFyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3Nzc4OTEyOTIsIm5hbWUiOiJDYW5kaWNlIEJhciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLa2ZlUEJpUWRmVkVjUjVOVjVOZk5oT0FFeDkxcXZRdHlpYk8wTklUZzYteWMtNExQUj1zOTYtYyIsImdpdmVuX25hbWUiOiJDYW5kaWNlIiwiZmFtaWx5X25hbWUiOiJCYXIiLCJpYXQiOjE3Nzc4OTE1OTIsImV4cCI6MTc3Nzg5NTE5MiwianRpIjoiMjEwMDE4ZmQyOGM1Yzk4ZDM2MDlkNTIzZjU2OWJkY2JjYTc2NTgwNyJ9.LRbnwq8LB_f0RrN28q4syosq50oOP9iNpoCRa7353Gs8Zm7qrL4CB6Eg6IcK9Twibg_v7I8aqvhJxOkEmr9xD2FQP1JMQSeS-VD2WpzxD2nHtHqZY194ANCL_QFwYpHcmLVWYHfmJKClrgsW6Y46ARqTUX6cz6g3-UB4y28GfTsyye21m6cY7Zt5I1LmVkBvCn5ipumaZNfSkth67SFhVl6w5r5cwlIFWmCARia4_XWZq5bgrW6cPwnQPcUz2ALZ1jiOPz9ks-f9nK6ukGWr56HdpXTIpc3kfKt9-xM5llAzMfZKDG4a4h2ybr1P4pFaI9lYS0YCrwv3J4CxI4WUPQ"});
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