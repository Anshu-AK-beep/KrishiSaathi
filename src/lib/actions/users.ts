"use server";

import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

// Define types manually until Prisma generates them
type UserRole = "FARMER" | "GOVERNMENT_OFFICIAL" | "ADMIN";
type Theme = "LIGHT" | "DARK" | "SYSTEM";

/**
 * Create or update a user based on email (for authentication)
 */
export async function syncUser(data: {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  countryCode?: string;
  languagePreference?: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        preferences: true,
        farms: true,
      },
    });

    if (existingUser) {
      // Update last login and optional fields
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          lastLogin: new Date(),
          fullName: data.fullName || existingUser.fullName,
          phoneNumber: data.phoneNumber || existingUser.phoneNumber,
          countryCode: data.countryCode || existingUser.countryCode,
        },
        include: {
          preferences: true,
          farms: true,
        },
      });
      return updatedUser;
    }

    // Create new user with default preferences
     const newUser = await prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode || "+91",
        languagePreference: data.languagePreference || "en",
        lastLogin: new Date(),
        preferences: {
          create: {
            language: data.languagePreference || "en",
          },
        },
      },
      include: {
        preferences: true,
        farms: true,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in syncUser:", error);
    throw new Error("Failed to sync user");
  }
}