import { requestingSampleType } from "@/core/models/sample/request";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sampleTable } from "./__db__";

export async function GET() {
  return NextResponse.json(sampleTable);
}

export async function POST(req: Request) {
  const data = await req.json();

  const newUser: requestingSampleType = {
    ...data,
    id: uuidv4(),
  };

  sampleTable.push(newUser);

  return NextResponse.json(newUser);
}

export async function PUT(req: Request) {
  const data = await req.json();

  const index = sampleTable.findIndex((user) => {
    return user.id === data.id;
  });

  sampleTable[index] = data;

  return NextResponse.json(data);
}
