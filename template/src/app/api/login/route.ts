import { authenticateSchemaType } from "@/core/models/user/authenticate";
import { usersTable } from "../users/__db__";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const creadentials: authenticateSchemaType = data;

  const foundUser = usersTable.find(
    (user) => user.email.toLowerCase() === creadentials.email.toLowerCase(),
  );

  if (foundUser) {
    // Exemplo de retorno com Token.
    return NextResponse.json({
      ...foundUser,
      access: "token_gerado_pelo_server",
    });
  }

  return NextResponse.json(
    {
      message: "Usuário não encontrado",
    },
    {
      status: 404,
    },
  );
}
