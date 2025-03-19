import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { PiGearDuotone } from "react-icons/pi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoDiamondSharp } from "react-icons/io5";
export function Settings() {
  return (
    <Menubar className="bg-transparent border-0">
      <MenubarMenu>
        <MenubarTrigger asChild className="cursor-pointer">
          <Button variant="icon" className="px-2 rounded-md hover:bg-slate-950">
            <PiGearDuotone size={20} color="white" />
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Geral</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Aparência</MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="flex items-center justify-start gap-2">
            <IoDiamondSharp size={18} />
            Premium
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="flex items-center justify-start gap-2">
            <IoIosHelpCircleOutline size={18} />
            Ajuda
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
