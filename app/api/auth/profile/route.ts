import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

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

export async function PUT(request: NextRequest) {
  try {
    const { id, name, age, gender, stylePreferences, weight, height, bodyType, location } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        age,
        gender,
        stylePreferences,
        weight,
        height,
        bodyType,
        location,
        isOnboarded: true, // Mark as onboarded when profile is updated
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isOnboarded: updatedUser.isOnboarded,
        age: updatedUser.age,
        gender: updatedUser.gender,
        stylePreferences: updatedUser.stylePreferences,
        weight: updatedUser.weight,
        height: updatedUser.height,
        bodyType: updatedUser.bodyType,
        location: updatedUser.location,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
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
        stylePreferences: user.stylePreferences,
        weight: user.weight,
        height: user.height,
        bodyType: user.bodyType,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
