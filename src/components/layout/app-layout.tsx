
'use client';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import NavMenu from './nav-menu';
import AppHeader from './app-header';
import Link from 'next/link';
import ElementIcon from '../icons/element-icon';
import { cn } from '@/lib/utils';
// Removed Tabs, TabsList, TabsTrigger, usePathname, and useIsMobile imports if no longer needed solely for bottom nav.
// If usePathname or useIsMobile are used for other purposes in this file, they should remain.
// For this specific request of removing bottom nav, they are assumed not to be needed further here.

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [defaultOpen, setDefaultOpen] = React.useState(true);
  // const pathname = usePathname(); // Keep if used elsewhere, remove if only for bottom nav
  // const isMobile = useIsMobile(); // Keep if used elsewhere, remove if only for bottom nav

  React.useEffect(() => {
    const storedState = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];
    if (storedState) {
      setDefaultOpen(storedState === 'true');
    }
  }, []);

  // Removed bottomNavItems and showBottomNav logic

  return (
    <SidebarProvider defaultOpen={defaultOpen} open={defaultOpen} onOpenChange={setDefaultOpen}>
      <Sidebar variant="inset" collapsible="icon" side="left" className="bg-sidebar text-sidebar-foreground">
        <SidebarRail />
        <SidebarHeader className="p-4 items-center justify-center flex">
            <Link href="/" className="flex items-center gap-2 group-data-[[data-collapsible=icon]]:hidden">
                <ElementIcon element="air" className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline text-sidebar-foreground">GetChiDa</h1>
            </Link>
             <Link href="/" className="items-center gap-2 hidden group-data-[[data-collapsible=icon]]:flex">
                <ElementIcon element="air" className="h-8 w-8 text-primary" />
            </Link>
        </SidebarHeader>
        <SidebarContent>
          <NavMenu />
        </SidebarContent>
        <SidebarFooter className="p-4 items-center justify-center flex">
          <p className="text-xs text-sidebar-foreground/70 group-data-[[data-collapsible=icon]]:hidden">© 2024 GetChiDa</p>
           <ElementIcon element="water" className="h-6 w-6 text-primary hidden group-data-[[data-collapsible=icon]]:block" />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className={cn(
          "flex-1 p-4 md:p-6 lg:p-8 overflow-auto",
          "bg-card rounded-lg shadow-lg m-0 md:m-4"
          // Removed conditional padding: showBottomNav ? "pb-20" : ""
        )}>
          {children}
        </main>

        {/* Global Bottom Navigation Removed */}
        
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
