import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GoogleLoginButton from "@/components/google-login";
import Button from "@/components/Button";
import Text from "@/components/Text";

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
