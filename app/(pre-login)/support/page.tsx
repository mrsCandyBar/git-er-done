import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Support() {
  return (
    <>
      <Header />
      <div className="intro">
          <Text as="h1">We're Here to Help</Text>
          <Text as="p">
            Sometimes tasks feel overwhelming, and that's okay. We're here to support you every step of the way. 
            Whether you have questions, feedback, or need assistance getting started, don't hesitate to reach out.
          </Text>
          <Text as="p">
            Email us at{" "}
            <a href="mailto:support@brioh.app">support@brioh.app</a>
            {" "}and we'll get back to you as soon as we can.
          </Text>

          <Button href="/login" variant="filled">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
          </Button>
        </div>
        <Footer activePage="support" />
    </>
  );
}
