import { NextResponse } from "next/server";
import { usersTable } from "../__db__";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "O parâmetro de consulta 'email' é obrigatório" },
      { status: 400 },
    );
  }

  const user = usersTable.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    return NextResponse.json(
      { message: "Usuário não encontado" },
      { status: 404 },
    );
  }

  return NextResponse.json(user);
}
