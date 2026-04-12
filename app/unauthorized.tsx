import Button from "../components/Button";
import buttonStyles from "../components/Button/Button.module.scss";

export default function Unauthorized() {
  return (
    <>
      <div className="intro">
        <h1>401 - Unauthorized</h1>
        <p>You must be signed in to access this part of the app.</p>
      </div>
      <div className={buttonStyles.group}>
        <Button variant="primary" href="/login">
          Back to Login
        </Button>
        <Button variant="secondary" href="/support">
          Support Page
        </Button>
      </div>
    </>
  );
}
