import { responseUserSchemaType } from "@/core/models/user/request";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { usersTable } from "./__db__";

export async function GET() {
  return NextResponse.json(usersTable);
}

export async function POST(req: Request) {
  const data = await req.json();

  const newUser: responseUserSchemaType = {
    ...data,
    id: uuidv4(),
  };

  usersTable.push(newUser);

  return NextResponse.json(newUser);
}

export async function PUT(req: Request) {
  const data = await req.json();

  const index = usersTable.findIndex((user) => {
    return user.id === data.id;
  });

  usersTable[index] = data;

  return NextResponse.json(data);
}
