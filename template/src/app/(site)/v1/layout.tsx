"use client";

import { Header } from "@/components/layout/Header";
import { SidebarMenu } from "@/components/layout/SidebarMenu";

export default function V1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh overflow-hidden relative">
      <Header /> {/** The Header is 56px of height */}
      <div className="h-[calc(100%-56px)] flex">
        <SidebarMenu />
        <main className="flex-grow overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
