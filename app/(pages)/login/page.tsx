import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GoogleLoginButton from "@/components/google-login";

export default function Login() {
  return (
    <>
      <Header />
      <div className="intro">
          <h1>Login page. To get started, edit the page.tsx file.</h1>
          
          <GoogleLoginButton />
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <Footer activePage="login" />
    </>
  );
}
