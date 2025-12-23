import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const chats = await prisma.message.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(chats);
};

export const POST = async (req: NextRequest) => {
  const { userId, content } = await req.json();

  if (!userId || !content) {
    return NextResponse.json({ error: "User ID and content are required" }, { status: 400 });
  }

  // Define prompts for stylist assistant
  const SYSTEM_PROMPT = `You are a professional stylist assistant specializing in fashion advice, outfit recommendations, and personal styling. Help users with:
- Outfit suggestions for different occasions
- Color coordination and clothing combinations
- Style tips based on body type, personal preferences, and trends
- Fashion advice for various seasons and climates
- Wardrobe organization and capsule wardrobe creation
- Shopping recommendations and where to find certain items

Be knowledgeable about current fashion trends, classic styles, and inclusive sizing. Ask relevant questions to provide personalized advice. Be friendly, encouraging, and professional.`;

  const GREETING = "Hello! I'm your personal stylist assistant. I'm here to help you with fashion advice, outfit recommendations, and all things style. What can I help you with today?";

  const messages = await prisma.message.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Build chat history for Groq
  const chatHistory: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "assistant",
      content: GREETING,
    },
  ];

  // Add previous messages to history
  messages.forEach((message) => {
    chatHistory.push({
      role: message.role === "model" ? "assistant" : (message.role as "user"),
      content: message.content,
    });
  });

  // Add the new user message
  chatHistory.push({
    role: "user",
    content,
  });

  try {
    // Call Groq API
    const chatResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatHistory,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiResponse = chatResponse.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Save user message
    await prisma.message.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        content,
        role: "user",
      },
    });

    // Save AI response
    await prisma.message.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        content: aiResponse,
        role: "model",
      },
    });

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error("Groq API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate response";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
