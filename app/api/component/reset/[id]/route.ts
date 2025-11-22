import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Validate ID
  if (!id) {
    return NextResponse.json(
      { error: "Component ID is required." },
      { status: 400 }
    );
  }

  const MAIN_KEY = `component:${id}`;
  const ORIGINAL_KEY = `component:${id}:original`;

  try {
    // Ensure main component exists
    const mainExists = await redis.exists(MAIN_KEY);
    if (!mainExists) {
      return NextResponse.json(
        { error: `Component '${id}' does not exist.` },
        { status: 404 }
      );
    }

    // Ensure original component exists
    const originalCode = await redis.get<string>(ORIGINAL_KEY);
    if (!originalCode) {
      return NextResponse.json(
        { error: `Original version for '${id}' not found.` },
        { status: 404 }
      );
    }

    // Restore original → main
    await redis.set(MAIN_KEY, originalCode);

    return NextResponse.json({
      id,
      message: `Component '${id}' successfully reset to original.`,
      code: originalCode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";

    return NextResponse.json(
      {
        error: "Failed to reset component.",
        details: message,
      },
      { status: 500 }
    );
  }
}
