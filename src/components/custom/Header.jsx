import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className="p-3 px-5 flex justify-between shadow-md">
      <img src="/public/logo.png" width={100} height={100} />
      {isSignedIn ? (
        <div className="flex item-center gap-4">
          <Link to={"/dashboard"}>
            <Button className="mt-1" variant="outline">
              Dashboard
            </Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to={"/auth/Sign-in"}>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
};

export default Header;
