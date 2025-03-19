import { Users } from "lucide-react";
import { ReactNode } from "react";
import { IoHome } from "react-icons/io5";
import { TbTemplate } from "react-icons/tb";

export interface AppRoutes {
  icon: ReactNode;
  label: string;
  url: string;
  restricted: boolean;
}

const routes: AppRoutes[] = [
  {
    icon: <IoHome size={24} />,
    label: "Home",
    url: "/v1/home",
    restricted: true,
  },
  {
    icon: <TbTemplate size={24} />,
    label: "Exemplo de CRUD",
    url: "/v1/sample",
    restricted: true,
  },
  {
    icon: <Users size={24} />,
    label: "Usuários",
    url: "/v1/users",
    restricted: true,
  },
];

export default routes;
