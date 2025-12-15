import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// @ts-ignore
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_Af6WDHR3CqTO@ep-shy-mouse-a1rbddgm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// @ts-ignore
const adapter = new PrismaPg(pool);

// @ts-ignore
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isOnboarded: false,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
