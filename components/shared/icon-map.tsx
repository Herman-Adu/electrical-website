'use client';

import {
  Shield,
  Clock,
  Award,
  ThumbsUp,
  CheckCircle,
  Zap,
  Building2,
  Factory,
  Home,
  Lightbulb,
  Wifi,
  Wrench,
  Phone,
  AlertTriangle,
  Battery,
  Plug,
  Settings,
  Gauge,
  ClipboardCheck,
  Users,
  Heart,
  Star,
  Activity,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/types/sections';

export const iconMap: Record<IconName, LucideIcon> = {
  Shield,
  Clock,
  Award,
  ThumbsUp,
  CheckCircle,
  Zap,
  Building2,
  Factory,
  Home,
  Lightbulb,
  Wifi,
  Wrench,
  Phone,
  AlertTriangle,
  Battery,
  Plug,
  Settings,
  Gauge,
  ClipboardCheck,
  Users,
  Heart,
  Star,
  Activity,
  BookOpen,
};

export function getIcon(name: IconName): LucideIcon {
  return iconMap[name] || Zap;
}
