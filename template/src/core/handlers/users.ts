import { API } from "@/config/api";
import { authenticateSchemaType } from "@/core/models/user/authenticate";
import { responseAuthenticationSchemaType } from "@/core/models/user/authentication-response";
import { responseUserSchemaType } from "@/core/models/user/request";
import { AxiosResponse } from "axios";

import {
  createUserSchema,
  createUserSchemaType,
} from "@/core/models/user/create";

import {
  updateUserSchema,
  updateUserSchemaType,
} from "@/core/models/user/update";

export interface ErrorFromApi {
  detail: string;
}

export async function authenticate(data: authenticateSchemaType) {
  const response: AxiosResponse<responseAuthenticationSchemaType> =
    await API.post("/login", data);

  return response.data;
}

export async function GetUserByEmail(email: string) {
  const response: AxiosResponse<responseUserSchemaType> = await API.get(
    "/users/byemail",
    {
      params: {
        email,
      },
    },
  );

  return response.data;
}

export async function getAllUsersHandler() {
  const response: AxiosResponse<responseUserSchemaType[]> =
    await API.get("/users");
  return response.data;
}

export async function createUserHandler(data: createUserSchemaType) {
  createUserSchema.parse(data);
  const response = await API.post(`/users`, data);
  if (response) {
    return response.data;
  } else {
    throw new Error("Erro");
  }
}

export async function updateUserHandler(data: updateUserSchemaType) {
  updateUserSchema.parse(data);
  const response = await API.put(`/users`, data);
  return response.data;
}

export async function deleteUserHandler(user: responseUserSchemaType) {
  const response = await API.delete(`/users/${user.id}`);
  if (response.status == 200) return user.id;
  throw new Error("Impossível deletar usuário");
}

export async function deleteAllUserHandler(users: responseUserSchemaType[]) {
  if (users.length == 0) return [];
  users.forEach(async (user) => await API.delete(`/users/${user.id}`));
  return users.map((user) => user.id);
}
