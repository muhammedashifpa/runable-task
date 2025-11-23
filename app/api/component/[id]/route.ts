import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

// GET /api/component/:id → fetch JSX
export async function GET(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const MAIN_KEY = `component:${id}`;
  try {
    const result = await redis.get(MAIN_KEY);

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: id,
      code: result,
    });
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// PUT /api/component/:id → update JSX
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing JSX code" }, { status: 400 });
  }
  const MAIN_KEY = `component:${id}`;
  try {
    await redis.set(MAIN_KEY, code);

    return NextResponse.json({
      message: "Component updated successfully",
      code,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    );
  }
}
