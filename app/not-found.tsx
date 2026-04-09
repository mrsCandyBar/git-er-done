import Button from "../components/Button";
import buttonStyles from "../components/Button/Button.module.scss";
import styles from "./(pages)/about/page.module.scss";

export default function NotFound() {
  return (
    <>
      <div className="intro">
        <h1>404 - Page not found</h1>
        <p>The page you requested could not be found.</p>
      </div>
      <div className={buttonStyles.group}>
        <Button variant="primary" href="/login">
          Go to Login
        </Button>
        <Button variant="secondary" href="/about">
          About Page
        </Button>
      </div>
    </>
  );
}
