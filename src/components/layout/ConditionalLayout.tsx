"use client";

import { usePathname } from "next/navigation";
import SidebarLayout from "@/components/layout/SidebarLayout";
import ChatWidget from "@/components/chat/ChatWidget";

const AUTH_PATHS = ["/login"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (AUTH_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <SidebarLayout>
      {children}
      <ChatWidget />
    </SidebarLayout>
  );
}
