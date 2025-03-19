import { NextRequest, NextResponse } from "next/server";
import { usersTable } from "../__db__";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const index = usersTable.findIndex((user) => {
    return user.id === id;
  });

  usersTable.splice(index, 1);

  return NextResponse.json({ userId: id });
}
