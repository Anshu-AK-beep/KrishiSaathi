"use client";

import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

function UserSync() {
  const { user, isSignedIn, isLoaded } = useUser(); // ✅ Added 'user'

  useEffect(() => {
    const handleUserSync = async () => {
      if (isLoaded && isSignedIn && user) { // ✅ Added 'user' check
        try {
          await syncUser({
            clerkUserId: user.id, // ✅ Added clerkUserId
            email: user.emailAddresses[0]?.emailAddress || "",
            fullName: user.fullName || undefined,
            phoneNumber: user.phoneNumbers[0]?.phoneNumber || undefined,
            countryCode: "+91", // Default, can be extracted from phone if needed
            languagePreference: "en", // Default
          });
        } catch (error) {
          console.log("Failed to sync user", error);
        }
      }
    };

    handleUserSync();
  }, [isLoaded, isSignedIn, user]); // ✅ Added 'user' to dependencies

  return null;
}

export default UserSync;