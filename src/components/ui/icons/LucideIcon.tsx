import React from 'react';
import { 
  // Common icons
  Plus, 
  Search, 
  X, 
  Check, 
  AlertCircle, 
  Loader2,
  Edit3 as Pencil,
  Trash2 as Trash,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Download,
  Printer,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clipboard,
  ClipboardList,
  // Navigation
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Menu,
  // Business
  Store as Storefront,
  Truck,
  CreditCard,
  Banknote as Money,
  Building2 as Bank,
  Building,
  MapPin,
  Globe,
  Cloud,
  Heart,
  Sun,
  Droplets,
  Brain,
  Shield,
  Sparkles,
  Zap,
  // Actions
  LogIn as SignIn,
  LogOut as SignOut,
  Settings,
  Users,
  User,
  Smartphone as DeviceMobile,
  Clock,
  Package,
  ShoppingBag,
  House,
  Calculator,
  Wallet,
  Calendar,
  MessageCircle,
  FileText,
  ShoppingCart,
  Star,
  Award as Certificate,
  Tag,
  Leaf,
  // Status
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TriangleAlert as Warning,
  Bell,
  // Analytics
  BarChart3,
  TrendingUp as ChartUp,
  Activity,
  PieChart,
  type LucideIcon as LucideIconType
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Icon mapping for easy migration from old icon names
const iconMap = {
  // Common actions
  'plus': Plus,
  'search': Search,
  'magnifyingglass': Search,
  'x': X,
  'check': Check,
  'pencil': Pencil,
  'edit': Pencil,
  'trash': Trash,
  'eye': Eye,
  'eyeoff': EyeOff,
  'mail': Mail,
  'envelopesimple': Mail,
  'lock': Lock,
  'phone': Phone,
  'download': Download,
  'downloadsimple': Download,
  'printer': Printer,
  'filearrowdown': Printer,
  
  // Navigation
  'chevrondown': ChevronDown,
  'chevronup': ChevronUp,
  'chevronleft': ChevronLeft,
  'chevronright': ChevronRight,
  'arrowleft': ArrowLeft,
  'arrow-left': ArrowLeft,
  'arrowright': ArrowRight,
  'refresh-cw': RefreshCw,
  'menu': Menu,
  
  // Business
  'storefront': Storefront,
  'truck': Truck,
  'credit-card': CreditCard,
  'creditcard': CreditCard,
  'money': Money,
  'bank': Bank,
  'buildings': Building,
  'mappin': MapPin,
  'map-pin': MapPin,
  'globe': Globe,
  'cloud': Cloud,
  'heart': Heart,
  'sun': Sun,
  'droplets': Droplets,
  'brain': Brain,
  'shield': Shield,
  'sparkles': Sparkles,
  'zap': Zap,
  'award': Certificate,
  
  // Actions
  'signin': SignIn,
  'signout': SignOut,
  'settings': Settings,
  'users': Users,
  'user': User,
  'devicemobile': DeviceMobile,
  'clock': Clock,
  'package': Package,
  'shoppingcart': ShoppingCart,
  'shoppingCart': ShoppingCart,
  'shoppingbag': ShoppingBag,
  'shoppingBag': ShoppingBag,
  'shopping-bag': ShoppingBag,
  'house': House,
  'calculator': Calculator,
  'wallet': Wallet,
  'calendar': Calendar,
  'message-circle': MessageCircle,
  'file-text': FileText,
  'star': Star,
  'certificate': Certificate,
  'tag': Tag,
  'leaf': Leaf,
  'gear': Settings, // Map gear to settings icon
  'dollarsign': DollarSign,
  'dollar-sign': DollarSign,
  'currencydollar': DollarSign,
  'trendingup': TrendingUp,
  'trendup': TrendingUp,
  'trendingdown': TrendingDown,
  'trenddown': TrendingDown,
  'caretleft': ChevronLeft,
  'caretright': ChevronRight,
  'clipboard': Clipboard,
  'clipboardtext': ClipboardList,
  
  // Status & Alerts
  'alert-circle': AlertCircle,
  'alertcircle': AlertCircle,
  'xcircle': XCircle,
  'checkcircle': CheckCircle,
  'check-circle': CheckCircle,
  'alerttriangle': AlertTriangle,
  'warning': Warning,
  'info': Info,
  'loader': Loader2,
  'circlenotch': Loader2, // Loading spinner
  'bell': Bell,
  // Analytics icons
  'barchart': BarChart3,
  'barchart3': BarChart3,
  'analytics': BarChart3,
  'chartup': ChartUp,
  'activity': Activity,
  'piechart': PieChart,
  'chart': BarChart3,
} as const;

export type IconName = keyof typeof iconMap;

export interface LucideIconProps {
  name: IconName;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
  color?: string; // Allow any color class
}

const sizeMap = {
  'xs': 12,
  'sm': 16,
  'md': 20,
  'lg': 24,
  'xl': 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
} as const;

const LucideIcon: React.FC<LucideIconProps> = ({ 
  name, 
  size = 'md', 
  className = '',
  color
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return <AlertCircle size={typeof size === 'string' ? sizeMap[size] : size} className={cn('text-red-500', className)} />;
  }

  const iconSize = typeof size === 'string' ? sizeMap[size] : size;
  
  return (
    <IconComponent 
      size={iconSize}
      className={cn(
        'inline-block',
        color && `text-${color}`,
        className
      )}
    />
  );
};

export default LucideIcon;
