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
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isOnboarded: user.isOnboarded,
        age: user.age,
        gender: user.gender,
        stylePreference: user.stylePreference,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
