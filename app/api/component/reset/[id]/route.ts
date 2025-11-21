import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile, writeFile, access } from "fs/promises";
import { constants } from "fs";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 1. Validate ID
  if (!id) {
    return NextResponse.json(
      { error: "Component ID is required." },
      { status: 400 }
    );
  }

  const dataDir = path.join(process.cwd(), "data");
  const mainFile = path.join(dataDir, `${id}.txt`);
  const originalFile = path.join(dataDir, `${id}.original.txt`);

  try {
    // 2. Check main file exists
    await access(mainFile, constants.F_OK);
  } catch {
    return NextResponse.json(
      { error: `Component '${id}' does not exist.` },
      { status: 404 }
    );
  }

  try {
    // 3. Check original file exists
    await access(originalFile, constants.F_OK);
  } catch {
    return NextResponse.json(
      { error: `Original version for '${id}' not found.` },
      { status: 404 }
    );
  }

  try {
    // 4. Read from original
    const originalCode = await readFile(originalFile, "utf8");

    // 5. Overwrite main file
    await writeFile(mainFile, originalCode, { encoding: "utf8" });

    // 6. Return response
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
