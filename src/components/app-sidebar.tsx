'use client';

import * as React from 'react';
import { Inbox, MessageSquareDot, Rss, Settings2, Trash2 } from 'lucide-react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
import { NavWorkspaces } from '@/components/nav-workspaces';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { AccountSwitcher } from './account-switcher';
import { NavSecondary } from './nav-secondary';

const data = {
  accounts: [
    {
      name: 'Personal',
      logo: MessageSquareDot,
      plan: 'Premium',
    },
    {
      name: 'Work',
      logo: MessageSquareDot,
      plan: 'Basic',
    },
  ],
  navMain: [
    {
      title: 'Inbox',
      url: '/app/inbox',
      icon: Inbox,
      badge: '10',
    },
    {
      title: 'Subscriptions',
      url: '/app/subscriptions',
      icon: Rss,
      badge: '53',
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Trash',
      url: '#',
      icon: Trash2,
    },
  ],
  favorites: [
    {
      name: 'Project Management & Task Tracking',
      url: '#',
      emoji: '📊',
    },
    {
      name: 'Family Recipe Collection & Meal Planning',
      url: '#',
      emoji: '🍳',
    },
  ],
  workspaces: [
    {
      name: 'Personal Life Management',
      emoji: '🏠',
      pages: [
        {
          name: 'Daily Journal & Reflection',
          url: '#',
          emoji: '📔',
        },
        {
          name: 'Health & Wellness Tracker',
          url: '#',
          emoji: '🍏',
        },
        {
          name: 'Personal Growth & Learning Goals',
          url: '#',
          emoji: '🌟',
        },
      ],
    },
    {
      name: 'Travel & Adventure',
      emoji: '🧳',
      pages: [
        {
          name: 'Trip Planning & Itineraries',
          url: '#',
          emoji: '🗺️',
        },
        {
          name: 'Travel Bucket List & Inspiration',
          url: '#',
          emoji: '🌎',
        },
        {
          name: 'Travel Journal & Photo Gallery',
          url: '#',
          emoji: '📸',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <AccountSwitcher accounts={data.accounts} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
