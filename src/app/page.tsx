import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
  <div>
    <h1>Home Page</h1>
    <SignedOut>
      <SignUpButton mode="modal">Sign up</SignUpButton>
    </SignedOut>

    <SignedIn>
      <SignOutButton>Logout</SignOutButton>
    </SignedIn>
  </div>
  );
}
