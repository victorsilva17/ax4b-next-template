import { UserRoleEnum } from "./userRole.enum";
import { z } from "zod";

export const responseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  active: z.boolean(),
  role: z.nativeEnum(UserRoleEnum),
  createdAt: z.string().date(),
});

export type responseUserSchemaType = z.infer<typeof responseUserSchema>;
