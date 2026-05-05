import { Header, Footer, Button, Text } from "@/components/index";
import GoogleLoginButton from "@/components/google-login";

export default function Login() {
  return (
    <>
      <Header />
      <div className="intro">
          <Text as="h1">Let's do great things together</Text>

          <GoogleLoginButton />
          <Button href="/profile" variant="outline">
            Continue to Post-Login Preview
          </Button>
        </div>
        <Footer />
    </>
  );
}
