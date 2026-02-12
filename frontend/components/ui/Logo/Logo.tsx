import Link from "next/link";
import TUSvg from "assets/svg/tugraz.svg";
import styles from "./Logo.module.css";

const Logo = (props: { className?: string }) => {
  const { className } = props;

  return (
    <Link className={className} href="/">
      <TUSvg className={styles.Logo} />
    </Link>
  );
};

export { Logo };
