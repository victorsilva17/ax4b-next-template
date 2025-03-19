import * as zod from "zod";

export enum SampleGenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export const creatingSampleSchema = zod.object({
  product: zod
    .string()
    .min(1, "Nome do produto é obrigatório")
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

export type creatingSampleType = zod.infer<typeof creatingSampleSchema>;
