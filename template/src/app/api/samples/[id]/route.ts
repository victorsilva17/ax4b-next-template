import { NextRequest, NextResponse } from "next/server";
import { sampleTable } from "../__db__";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const index = sampleTable.findIndex((sample) => {
    return sample.id === id;
  });

  sampleTable.splice(index, 1);

  return NextResponse.json({ sampleId: id });
}
