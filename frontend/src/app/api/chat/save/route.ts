// src/app/api/chat/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, chat } = body;

    // Get current user from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the userId matches the logged-in user
    if (userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Save or update chat in database
    const savedChat = await prisma.chatHistory.upsert({
      where: { id: chat.id },
      update: {
        title: chat.title,
        messages: JSON.stringify(chat.messages),
        updatedAt: new Date(),
      },
      create: {
        id: chat.id,
        userId: user.id,
        title: chat.title,
        messages: JSON.stringify(chat.messages),
      },
    });

    return NextResponse.json({ 
      success: true,
      message: "Chat saved successfully",
      chatId: savedChat.id
    });

  } catch (error: any) {
    console.error("Error saving chat:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save chat" },
      { status: 500 }
    );
  }
}