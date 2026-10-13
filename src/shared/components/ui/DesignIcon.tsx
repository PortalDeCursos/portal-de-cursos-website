import { createElement } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  FlaskConical,
  GraduationCap,
  Info,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Moon,
  Search,
  Send,
  Sun,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';

const exactIcons: Record<string, LucideIcon> = {
  imgcontainer: ArrowRight,
  imgcontainer1: ArrowRight,
  imgcontainer2: Clock3,
  imgcontainer3: Building2,
  imgcontainer4: Moon,
  imgcontainer5: Sun,
  imgcontainer6: Lightbulb,
  imgcontainer7: Send,
  'catalog-imgcontainer': ChevronRight,
  'catalog-imgcontainer1': X,
  'catalog-imgcontainer2': Clock3,
  'catalog-imgcontainer3': Clock3,
  'catalog-imgcontainer4': Building2,
  'catalog-imgcontainer5': Moon,
  'catalog-imgcontainer6': ArrowRight,
  'catalog-imgcontainer7': Sun,
  'catalog-imgcontainer8': CircleHelp,
  'catalog-imgcontainer9': Lightbulb,
  'catalog-imgcontainer10': MessageCircle,
  'catalog-imgicon': Search,
  'catalog-imgicon1': ChevronDown,
};

function resolveIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase();
  const exact = exactIcons[normalized];
  if (exact) return exact;
  if (normalized.includes('loading')) return LoaderCircle;
  if (normalized.includes('search') || normalized.includes('busca')) return Search;
  if (normalized.includes('filter') || normalized.includes('filtro')) return ChevronDown;
  if (normalized.includes('remove') || normalized.includes('close')) return X;
  if (normalized.includes('course') || normalized.includes('graduat')) return GraduationCap;
  if (normalized.includes('lab') || normalized.includes('research')) return FlaskConical;
  if (normalized.includes('project')) return Lightbulb;
  if (normalized.includes('coord') || normalized.includes('user')) return Users;
  if (normalized.includes('detail')) return FileText;
  if (normalized.includes('empty') || normalized.includes('help')) return Info;
  if (normalized.includes('calendar')) return CalendarDays;
  if (normalized.includes('clock') || normalized.includes('duration')) return Clock3;
  if (normalized.includes('catalog')) return BookOpen;
  return ArrowRight;
}

export default function DesignIcon({ name }: { name: string }) {
  const Icon = resolveIcon(name);
  return createElement(Icon, {
    className: 'design-icon',
    'aria-hidden': true,
    strokeWidth: 1.8,
  });
}
