"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { Subtitles, Home, Settings, User } from "lucide-react"; // Import additional icons

export function AppSidebar() {
  return (
    <Sidebar className="w-20"> {/* Set a fixed width for the sidebar */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex flex-col items-center p-2">
            <button className="bg-none border-none cursor-pointer mb-5" onClick={() => alert('Home clicked')}>
              <Home size={30} />
            </button>
            <button className="bg-none border-none cursor-pointer mb-5" onClick={() => alert('Subtitles clicked')}>
              <Subtitles size={30} />
            </button>
            <button className="bg-none border-none cursor-pointer mb-5" onClick={() => alert('Settings clicked')}>
              <Settings size={30} />
            </button>
            <button className="bg-none border-none cursor-pointer mb-5" onClick={() => alert('User clicked')}>
              <User size={30} />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Sidebar group content goes here */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
