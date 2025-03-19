import { UserRoleEnum } from "./userRole.enum";
import { z } from "zod";

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail não está no formato correto"),
  name: z.string().min(1, "Nome completo é obrigatório").max(255),
  active: z.boolean(),
  role: z.nativeEnum(UserRoleEnum, {
    invalid_type_error: "Opção do Enum inválida",
    required_error: "Tipo do usuário é obrigatório",
  }),
});

export type updateUserSchemaType = z.infer<typeof updateUserSchema>;
