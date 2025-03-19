import * as zod from "zod";

import { SampleGenderEnum } from "./create";

export const updatingSampleSchema = zod.object({
  id: zod
    .string({ required_error: "Um Identificador (ID) é necessário" })
    .uuid(),
  product: zod
    .string()
    .min(1, "Produto é obrigatório")
    .max(255, "Você ultrapassou o limite de caracteres (255)"),
  amount: zod
    .number()
    .min(1, "Quantidade é obrigatória")
    .nonnegative("Quantidade deve ser um número positivo"),
  contact_support: zod.string().email("E-mail não está no formato correto"),
  secret_key: zod
    .string()
    .min(8, "Chave secreta deve conter no mínimo 8 caracteres")
    .regex(/^[^\s]+$/, "Chave secreta não deve conter espaços"),

  isAvailable: zod.boolean().default(true),
  validDate: zod.date({
    message: "Data válida não está no formato correto",
  }),
  price: zod.string(),
  gender: zod.nativeEnum(SampleGenderEnum, {
    required_error: "Gênero é obrigatório",
  }),
  preferences: zod.array(zod.string()),
});

export type updatingSampleType = zod.infer<typeof updatingSampleSchema>;
