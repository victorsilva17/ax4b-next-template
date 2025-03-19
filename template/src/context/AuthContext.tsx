"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/core/service/AuthService";
import { GetUserByEmail } from "@/core/handlers/users";
import { useToast } from "@/components/ui/use-toast";
import { getUserSession } from "@/hooks/useProfile";

interface AuthContextType {
  user: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const initializeAuth = async () => {
      const userSession = getUserSession();
      if (userSession) {
        setUser(userSession);
      }
    };
    initializeAuth();
  }, [router, pathname]);

  if (!isMounted) return null;

  const verify = async (email: string) => {
    const response = await GetUserByEmail(email);
    if (response) {
      setUser(response);
      return response;
    }
  };

  const isThereAnyMsCredentialMissing = (): boolean => {
    return (
      process.env.NEXT_PUBLIC_AUTH_CLIENT_ID === "" ||
      process.env.NEXT_PUBLIC_AUTH_AUTHORITY === "" ||
      process.env.NEXT_PUBLIC_AUTH_SCOPES === "" ||
      process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI === ""
    );
  };

  const login = async () => {
    if (isThereAnyMsCredentialMissing()) {
      toast({
        title: `Erro no login`,
        description:
          "Erro ao tentar fazer login, verifique se as variáveis de ambiente estão configuradas corretamente",
      });
      return;
    }

    try {
      const loginResponse = await authService.login();

      const userSession = await verify(loginResponse.account.username);

      setUser(userSession);

      Cookies.set("authToken", loginResponse.accessToken, {
        secure: process.env.NODE_ENV === "production",
        expires: 1,
      });

      Cookies.set("userSession", JSON.stringify(userSession), {
        secure: process.env.NODE_ENV === "production",
        expires: 1,
      });

      router.push("/v1/maps");
    } catch (error) {
      console.error("Erro de login:", error);
      toast({
        title: `Erro no login`,
        description:
          "Erro ao tentar fazer login, verifique se o Usuário está cadastrado na aplicação",
      });
      logout();
    }
  };

  const logout = async () => {
    try {
      if (!isThereAnyMsCredentialMissing()) await authService.logout();

      Cookies.remove("authToken");
      Cookies.remove("userSession");

      setUser(null);

      router.push("/login");
    } catch (error) {
      toast({
        title: `Erro no logout`,
        description: "Erro ao tentar fazer logout",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
