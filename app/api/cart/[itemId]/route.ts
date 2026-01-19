import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

// Update cart item quantity
export const PUT = async (req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) => {
  try {
    const { quantity } = await req.json();
    const { itemId } = await params;

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true }
    });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Cart item update error:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
};

// Remove item from cart
export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) => {
  try {
    const { itemId } = await params;

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart item delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
};
