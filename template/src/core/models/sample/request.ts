import * as zod from "zod";

export const requestingSampleSchema = zod.object({
  id: zod.string().uuid(),
  product: zod.string(),
  amount: zod.number(),
  contact_support: zod.string().email(),
  secret_key: zod.string(),
  isAvailable: zod.boolean().default(true),
  validDate: zod.string().datetime(),
  price: zod.number().positive(),
  gender: zod.string(),
  preferences: zod.array(zod.string()),
});

export type requestingSampleType = zod.infer<typeof requestingSampleSchema>;
