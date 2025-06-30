/**
 * Icon Registry - Centralized collection of all icons used in the application
 *
 * IMPORTANT: Only import the specific icons that are actually used in the application
 * to reduce bundle size. The full Phosphor library is ~9MB!
 */
import {
  // Navigation icons
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  ArrowLeft,

  // Action icons
  FileArrowDown,
  Storefront,
  ArrowRight,
  ArrowDownRight,
  DownloadSimple,
  X,
  SignIn,
  List,
  Eye,
  Clipboard,
  ClipboardText,
  CircleNotch,
  ArrowClockwise,
  SignOut,
  Gear,
  CreditCard,
  Plus,
  Minus,
  Tag,
  Funnel,
  MagnifyingGlass,

  // Social icons
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,

  // Form icons
  User,
  Users,
  EnvelopeSimple,
  Phone,
  Buildings,
  Lock,
  EyeSlash,

  // Feedback icons
  CheckCircle,
  XCircle,
  Warning,
  WarningCircle,
  Info,

  // Business/brand icons
  ListChecks,
  Target,
  Medal,
  Article,
  Certificate,

  // Nature/sustainability icons
  Tree,
  Leaf,
  Plant,
  SunHorizon,
  Waves,
  Drop,

  // Additional common icons
  House,
  Globe,
  Translate,
  ShoppingBag,
  ShoppingCart,

  // Reviews section icons
  Star,
  StarHalf,
  ChatCircleText,
  Check,
  Quotes,
} from '@phosphor-icons/react';

/**
 * Map of all icon components used in the application
 * IMPORTANT: All keys are now in lowercase for consistent case-insensitive lookup
 */
export const iconRegistry = {
  // Navigation
  caretdown: CaretDown,
  caretleft: CaretLeft,
  caretright: CaretRight,
  caretup: CaretUp,
  arrowleft: ArrowLeft,

  // Actions
  filearrowdown: FileArrowDown,
  storefront: Storefront,
  arrowright: ArrowRight,
  arrowdownright: ArrowDownRight,
  downloadsimple: DownloadSimple,
  clipboard: Clipboard,
  clipboardtext: ClipboardText,
  circlenotch: CircleNotch,
  arrowclockwise: ArrowClockwise,
  signout: SignOut,
  gear: Gear,
  creditcard: CreditCard,
  x: X,
  signin: SignIn,
  list: List,
  eye: Eye,
  plus: Plus,
  minus: Minus,
  tag: Tag,
  funnel: Funnel,
  magnifyingglass: MagnifyingGlass,

  // Social
  facebooklogo: FacebookLogo,
  instagramlogo: InstagramLogo,
  twitterlogo: TwitterLogo,
  linkedinlogo: LinkedinLogo,

  // Form
  user: User,
  users: Users,
  envelope: EnvelopeSimple,
  envelopesimple: EnvelopeSimple,
  phone: Phone,
  buildings: Buildings,
  lock: Lock,
  eyeslash: EyeSlash,

  // Feedback
  checkcircle: CheckCircle,
  xcircle: XCircle,
  warning: Warning,
  warningcircle: WarningCircle,
  info: Info,
  check: Check,

  // Business/brand
  listchecks: ListChecks,
  target: Target,
  medal: Medal,
  article: Article,
  certificate: Certificate,

  // Nature/sustainability
  tree: Tree,
  leaf: Leaf,
  plant: Plant,
  sunhorizon: SunHorizon,
  waves: Waves,
  drop: Drop,

  // Additional common
  house: House,
  globe: Globe,
  translate: Translate,
  shoppingbag: ShoppingBag,
  shoppingcart: ShoppingCart,

  // Reviews section icons
  star: Star,
  starhalf: StarHalf,
  chatcircletext: ChatCircleText,
  quotes: Quotes,
};

/**
 * Get an icon component by name
 * @param {string} name - The name of the icon
 * @returns {Component|null} The icon component or null if not found
 */
export function getIcon(name) {
  const normalizedName = typeof name === 'string' ? name.toLowerCase() : '';
  return iconRegistry[normalizedName] || null;
}

// Exports all icons in an object for direct access
export default iconRegistry;