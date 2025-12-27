import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import FarmProfileForm from "@/components/farm/FarmProfileForm";

async function FarmProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <Navbar />
      <FarmProfileForm />
    </>
  );
}

export default FarmProfilePage;