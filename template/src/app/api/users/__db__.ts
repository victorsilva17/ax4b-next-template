import { responseUserSchemaType } from "@/core/models/user/request";
import { UserRoleEnum } from "@/core/models/user/userRole.enum";

export const usersTable: responseUserSchemaType[] = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    email: "john.doe@example.com",
    name: "John Doe",
    active: true,
    role: UserRoleEnum.admin,
    createdAt: "2023-05-15T10:30:00.000Z",
  },
  {
    id: "e1c2d3f4-5b6a-7c8d-9e0f-1a2b3c4d5e6f",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    active: false,
    role: UserRoleEnum.viewer,
    createdAt: "2022-11-20T14:45:00.000Z",
  },
  {
    id: "a1234567-89ab-cdef-0123-456789abcdef",
    email: "victor.silvaPC@hotmail.com",
    name: "Victor Silva",
    active: true,
    role: UserRoleEnum.admin,
    createdAt: "2021-08-10T08:15:00.000Z",
  },
];
