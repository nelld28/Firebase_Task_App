'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/profiles')) return 'Profiles';
  if (pathname.startsWith('/chores')) return 'Chores';
  if (pathname.startsWith('/motivational-bot')) return 'Motivational Bending Bot';
  // Capitalize first letter and replace dashes with spaces
  const title = pathname.substring(1).replace(/-/g, ' ');
  return title.charAt(0).toUpperCase() + title.slice(1) || 'GetChiDa';
};

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6',
        className
      )}
    >
      <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl font-headline">{pageTitle}</h1>
        {/* Placeholder for user avatar/menu */}
        {/* <UserNav /> */}
      </div>
    </header>
  );
};

export default AppHeader;
