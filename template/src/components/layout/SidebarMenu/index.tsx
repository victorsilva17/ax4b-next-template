"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CgMenu } from "react-icons/cg";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import routes from "@/routes";

export function SidebarMenu() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col overflow-hidden overflow-y-auto bg-gray-100 border-r-2 h-full transition-width duration-300 ease-in-out min-w-16 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Trigger Button */}
      <div className="py-2">
        <Button
          variant="icon"
          id="toggleSidebar"
          onClick={toggleSidebar}
          className="focus:outline-none rounded-none text-gray-950 min-w-16"
        >
          <CgMenu size={24} />
        </Button>
      </div>

      {/* Menu Items */}
      <TooltipProvider>
        {routes.map((route) => {
          return (
            <Tooltip key={route.url} delayDuration={300}>
              <TooltipTrigger>
                <Button
                  variant="icon"
                  className={`min-w-16 p-4 h-auto flex flex-row ${isCollapsed ? "gap-0" : "gap-4"} ${isCollapsed ? "justify-center" : "justify-start"} text-gray-950 rounded-none hover:bg-gray-300`}
                  asChild
                >
                  <Link href={route.url}>
                    {route.icon}
                    <span
                      className={`overflow-hidden transition-width duration-300 ${isCollapsed ? "w-0" : "w-auto"}`}
                    >
                      {route.label}
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{route.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
