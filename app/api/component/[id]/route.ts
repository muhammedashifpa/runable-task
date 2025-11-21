import { NextRequest, NextResponse } from "next/server";
// import { getComponent, updateComponent } from "@/lib/db";
import { readFile, writeFile } from "fs/promises";
import path from "path";

// GET /api/component/:id → fetch JSX
export async function GET(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("Fetching component with id:", context);

  try {
    const filePath = path.join(process.cwd(), "data", `${id}.txt`);
    const content = await readFile(filePath, "utf8");

    return NextResponse.json({
      id: id,
      code: content,
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

  try {
    const filePath = path.join(process.cwd(), "data", `${id}.txt`);

    // Write updated content
    await writeFile(filePath, code, "utf8");

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
