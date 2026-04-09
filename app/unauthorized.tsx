import Button from "../components/Button";
import buttonStyles from "../components/Button/Button.module.scss";
import styles from "./(pages)/about/page.module.scss";

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
        <Button variant="secondary" href="/about">
          About Page
        </Button>
      </div>
    </>
  );
}
