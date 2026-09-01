// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  ArrowRightLeft,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Puzzle,
  RefreshCcw,
  Rocket,
  Server,
  Settings,
  User,
  Users,
  VenetianMask,
  Workflow,
} from 'lucide-react';
import type { ComponentType } from 'react';

// Version-agnostic icon type: lucide icons satisfy this, but the shared `Item`
// type is not pinned to a specific lucide-react/@types/react instance (so
// downstream consumers on a different lucide version still type-check).
export type IconComponent = ComponentType<{ className?: string; size?: string | number }>;

export type Item = {
  title: string;
  url?: string;
  visible?: boolean;
  icon?: IconComponent;
  isActive?: boolean;
  queryParams?: object;
  items?: {
    max_role?: number;
    title: string;
    icon?: IconComponent;
    url: string;
    queryParams?: object;
  }[];
};

export const items: Item[] = [
  {
    title: 'Connections',
    icon: ArrowRightLeft,
    items: [
      {
        title: 'Provider',
        url: '/provider',
        icon: Server,
      },
      {
        title: 'Rotation',
        url: '/rotation',
        icon: RefreshCcw,
      },
    ],
  },
  {
    title: 'Team Management',
    icon: Users,
    items: [
      {
        title: 'Team',
        icon: User,
        url: '/team',
      },
      {
        title: 'Team Training',
        icon: GraduationCap,
        url: '/settings/training',
        queryParams: {
          mode: 'company',
        },
      },
      {
        title: 'Team Extensions',
        icon: Puzzle,
        url: '/settings/extensions',
        queryParams: {
          tab: 'extensions',
          mode: 'company',
        },
      },
      {
        title: 'Team Abilities',
        icon: Workflow,
        url: '/settings/extensions',
        queryParams: {
          tab: 'abilities',
          mode: 'company',
        },
      },
      {
        title: 'Team Settings',
        icon: Settings,
        url: '/settings',
        queryParams: {
          mode: 'company',
        },
      },
    ],
  },
  {
    title: 'Documentation',
    icon: BookOpen,
    items: [
      {
        title: 'Getting Started',
        icon: Rocket,
        url: '/docs/getting-started',
      },
      {
        title: 'API Reference',
        icon: BookOpen,
        url: '/docs/api-reference',
      },
      {
        title: 'Support',
        icon: HelpCircle,
        url: '/docs/support',
      },
      {
        title: 'Privacy Policy',
        icon: VenetianMask,
        url: '/docs/privacy',
      },
    ],
  },
];
