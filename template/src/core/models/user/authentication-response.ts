import { UserRoleEnum } from "./userRole.enum";
import { z } from "zod";

export const responseAuthenticationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  active: z.boolean(),
  role: z.nativeEnum(UserRoleEnum),
  createdAt: z.string().date(),
  access: z.string(), // Acess Token
});

export type responseAuthenticationSchemaType = z.infer<
  typeof responseAuthenticationSchema
>;
