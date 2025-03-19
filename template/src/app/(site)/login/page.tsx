"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import * as zod from "zod";

import microsoftIcon from "@/assets/microsoft-icon.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { authenticate } from "@/core/handlers/users";
import { AxiosError } from "axios";
import Image from "next/image";

const LoginFormSchema = zod.object({
  email: zod.string().email("Email inválido"),
  password: zod.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormType = zod.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitMutation = useMutation({
    mutationFn: async (data: LoginFormType) => {
      const user = await authenticate(data);

      Cookies.set("userSession", JSON.stringify(user));
      Cookies.set("authToken", user.access);

      console.log(user);
    },
    onSuccess: () => {
      toast({
        title: "Login efetuado com sucesso",
        description:
          "Você será redirecionado para a página inicial em alguns segundos",
      });

      router.push("/v1/home"); //TODO: change this to the initial route.
    },
    onError: (error: AxiosError | Error) => {
      const message = {
        title: "Erro ao fazer login",
        description:
          error instanceof AxiosError
            ? error.response?.data.message
            : error.message,
      };

      toast(message);
    },
  });

  return (
    <div
      className="w-dvw h-dvh overflow-hidden relative "
      style={{ background: "linear-gradient(to right, #031795, #347FF6)" }}
    >
      <div className="justify-center items-center h-full w-full flex">
        <div className="flex border-[1px] rounded-lg shadow-lg flex-col bg-white ">
          <h1 className="mt-8 mx-4 font-bold text-3xl text-center text-[#020f61]">
            LOGIN
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                handleSubmitMutation.mutate(data),
              )}
              className="h-full w-full flex-col space-y-8 p-8"
            >
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-col flex w-80">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full mt-1 focus-visible:ring-[#347FF6] focus-visible:ring-offset-0"
                        placeholder="Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-col flex w-80">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="w-full mt-1 focus-visible:ring-[#347FF6] focus-visible:ring-offset-0"
                        placeholder="Insira sua senha"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4 w-80 justify-between">
                <Button
                  type="submit"
                  className="mb-1 bg-[#031795] hover:bg-[#0525F5]"
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#031795] text-[#031795] hover:bg-[#DFE3FE] hover:text-[#031795] gap-3"
                  onClick={login}
                >
                  <Image
                    src={microsoftIcon}
                    alt="Microsoft Svg Icon"
                    width={20}
                    height={20}
                  />
                  Login com Microsoft
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
