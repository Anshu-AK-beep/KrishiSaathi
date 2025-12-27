import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// GET - Fetch all users (with optional role filter)
export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkUserId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create user in database
    let currentDbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }, // ✅ Use clerkUserId field
    });

    // If user doesn't exist, create them
    if (!currentDbUser) {
      currentDbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
          role: (clerkUser.publicMetadata?.role as UserRole) || "FARMER",
          isActive: true,
          lastLogin: new Date(),
        },
      });
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: currentDbUser.id },
        data: { lastLogin: new Date() },
      });
    }

    // Check if user is admin
    const isAdmin = currentDbUser.role === "ADMIN";

    // Get role filter from query params
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") as UserRole | null;

    // Only admins can view other users or filter by role
    if (role && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Build query based on permissions
    const whereClause = role 
      ? { role } // Admin filtering by role
      : isAdmin 
        ? {} // Admin sees all users
        : { id: currentDbUser.id }; // Regular users see only themselves

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            predictions: true,
            farms: true,
          },
        },
        farms: {
          select: {
            id: true,
            name: true,
            location: true,
            totalArea: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user (typically handled by Clerk, but available for manual creation)
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin permission
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        clerkUserId: body.clerkUserId || "", // Allow manual clerk user ID
        fullName: body.fullName || null,
        phoneNumber: body.phoneNumber || null,
        countryCode: body.countryCode || "+91",
        role: body.role || "FARMER",
        languagePreference: body.languagePreference || "en",
        isVerified: body.isVerified || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email or clerkUserId already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}