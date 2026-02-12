import Button from "@mui/material/Button";
import { Logo } from "components/ui";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="fixed top-0 bg-green w-full p-16 z-20">
      <div className="flex justify-between items-center w-full">
        <Logo className="w-[10rem]" />
        <Link href="/mealcreator" legacyBehavior>
          <Button
            component="a"
            variant="outlined"
            color="secondary"
            size="large"
            className="text-[1.4rem]"
          >
            Participate Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
