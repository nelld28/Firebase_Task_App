
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListChecks, CalendarDays, BarChart3 } from 'lucide-react'; // Specific icons for bottom nav
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [defaultOpen, setDefaultOpen] = React.useState(true);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const storedState = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];
    if (storedState) {
      setDefaultOpen(storedState === 'true');
    }
  }, []);

  const bottomNavItems = [
    { href: '/chores', label: 'Tasks', icon: ListChecks }, // Chores page now acts as Tasks
    { href: '/schedule', label: 'Schedule', icon: CalendarDays },
    { href: '/xp', label: 'XP', icon: BarChart3 },
  ];

  // Show bottom nav on mobile for any page using this layout.
  const showBottomNav = isMobile;

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
          "bg-card rounded-lg shadow-lg m-0 md:m-4",
          showBottomNav ? "pb-20" : "" // Add padding-bottom if bottom nav is shown
        )}>
          {children}
        </main>

        {/* Global Bottom Navigation */}
        {showBottomNav && (
          <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden"> {/* Hidden on md and larger screens */}
            <Tabs value={pathname} className="w-full"> {/* Use pathname to control active tab */}
              <TabsList className="grid w-full grid-cols-3 h-16 bg-card border-t border-border shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1),_0_-1px_3px_-1px_rgba(0,0,0,0.06)] p-1">
                {bottomNavItems.map(tab => (
                  <TabsTrigger
                    key={tab.href}
                    value={tab.href} // Radix Tabs expects value to match for active state
                    asChild
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 h-full text-xs rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
                      "data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent",
                      "data-[state=inactive]:text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    )}
                  >
                    <Link href={tab.href}>
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
