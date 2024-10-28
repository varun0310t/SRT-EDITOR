import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/EditStation/components/appsidebar";
import React, { CSSProperties } from "react";

// Extend CSSProperties to include custom properties
interface CustomCSSProperties extends CSSProperties {
  "--sidebar-width"?: string;
  "--sidebar-width-mobile"?: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const customStyle: CustomCSSProperties = {
    "--sidebar-width": "5rem",
    "--sidebar-width-mobile": "20rem",
  };

  return (
    <SidebarProvider style={customStyle}>
      <AppSidebar  />
      <main className="w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}
