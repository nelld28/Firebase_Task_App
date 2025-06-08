
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, ListChecks, Sparkles, Settings } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import ElementIcon from '@/components/icons/element-icon';

const NavMenu = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/profiles', label: 'Profiles', icon: Users },
    { href: '/chores', label: 'Chores', icon: ListChecks },
    { href: '/motivational-bot', label: 'Bending Bot', icon: Sparkles },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: 'right', align: 'center' }}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
       {/* Example of a menu item with sub-menu, can be adapted for elemental chore filtering if needed */}
      {/* <SidebarMenuItem>
        <SidebarMenuButton>
          <Settings />
          <span>Settings</span>
        </SidebarMenuButton>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <Link href="/settings/account" passHref legacyBehavior>
              <SidebarMenuSubButton isActive={pathname === '/settings/account'} asChild>
                <a>Account</a>
              </SidebarMenuSubButton>
            </Link>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
             <Link href="/settings/preferences" passHref legacyBehavior>
              <SidebarMenuSubButton isActive={pathname === '/settings/preferences'} asChild>
                <a>Preferences</a>
              </SidebarMenuSubButton>
            </Link>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem> */}
    </SidebarMenu>
  );
};

export default NavMenu;
