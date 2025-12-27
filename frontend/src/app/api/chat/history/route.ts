// src/app/api/chat/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
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

    // Get all chats for this user from database
    const chats = await prisma.chatHistory.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    // Parse the messages JSON
    const parsedChats = chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      messages: JSON.parse(chat.messages),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    return NextResponse.json({ chats: parsedChats });

  } catch (error: any) {
    console.error("Error loading chat history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load chat history" },
      { status: 500 }
    );
  }
}