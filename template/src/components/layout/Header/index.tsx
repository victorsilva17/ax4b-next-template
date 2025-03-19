"use client";

import { Button } from "@/components/ui/button";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { GlobalSearchBar } from "./GlobalSearchBar";
import { NotificationTray } from "./NotificationTray";
import { Settings } from "./Settings";
import { UserAvatar } from "./UserAvatar";

export function Header() {
  return (
    <header className="flex flex-row items-center justify-between gap-4 bg-slate-900 py-2 px-4">
      <div className="flex flex-row items-center justify-start gap-4">
        {/* Actions Painel */}
        <Button variant={"ghost"} className="px-2 hover:bg-slate-950">
          <BsFillGrid1X2Fill size={24} className="text-white" />
          {/** Here will be the Company Logo Icon */}
        </Button>

        <h1 className="scroll-m-20 text-xl text-white font-bold tracking-tight lg:text-2xl hidden md:block text-ellipsis truncate">
          Template for CRUDs
          {/** Here will be the Company name */}
        </h1>
      </div>

      <div className="flex-grow flex flex-row items-center justify-end gap-4">
        {/* Global Search Bar */}
        <GlobalSearchBar />

        {/* General */}
        <NotificationTray />
        <Settings />
        <UserAvatar />
      </div>
    </header>
  );
}
