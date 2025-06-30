import React, { useState, useEffect, useRef } from 'react';
import { tv } from 'tailwind-variants';
import { createPortal } from 'react-dom';
import Icon from '../icons/Icon';

// Global menu tracker to ensure only one menu is open at a time
const globalMenuTracker = {
  activeMenuId: null,
  listeners: new Set(),

  setActiveMenu(menuId) {
    this.activeMenuId = menuId;
    this.notifyListeners();
  },

  registerListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.activeMenuId));
  }
};

// Define the base menu styles using tailwind-variants
const styles = {
  menu: tv({
    base: 'relative',
    variants: {
      variant: {
        dropdown: 'inline-block z-90',
        navbar: 'flex items-center',
        sidebar: 'flex flex-col',
        form: 'w-full',
        translation: 'inline-block',
      },
      isMobile: {
        true: 'w-full',
      },
      isNavbarMobile: {
        true: 'static z-[200]',
      },
    },
    defaultVariants: {
      variant: 'dropdown',
    },
  }),

  container: tv({
    base: 'shadow-lg overflow-hidden z-100',
    variants: {
      variant: {
        dropdown: 'absolute top-full mt-2 right-0 w-64',
        navbar: 'flex',
        sidebar: 'h-full w-full',
        form: 'w-full',
        translation: 'absolute top-full mt-2 right-0 w-48',
      },
      position: {
        right: 'right-0 left-auto',
        left: 'left-0 right-auto',
        center: 'left-1/2 -translate-x-1/2',
      },
      glass: {
        true: 'bg-white border border-logo-lime/30',
        false: 'bg-white border border-neutral-200/80',
      },
      rounded: {
        default: 'rounded-xl',
        none: 'rounded-none',
        full: 'rounded-full',
        xl: 'rounded-xl',
      },
      isMobile: {
        true: 'w-full max-w-[360px]',
      },
      isNavbarMobile: {
        true: 'fixed top-[calc(var(--navbar-height-mobile)+1.25rem)] max-w-[calc(100vw-2rem)] z-[200]',
      },
    },
    defaultVariants: {
      variant: 'dropdown',
      position: 'right',
      glass: false,
      rounded: 'xl',
    },
    compoundVariants: [
      {
        variant: 'dropdown',
        isMobile: true,
        class: 'w-full right-auto left-1/2 -translate-x-1/2 max-w-[360px]',
      },
      {
        isNavbarMobile: true,
        position: 'right',
        class: 'right-4 left-auto',
      },
      {
        isNavbarMobile: true,
        position: 'left',
        class: 'left-4 right-auto',
      },
      {
        isNavbarMobile: true,
        position: 'center',
        class: 'left-1/2 -translate-x-1/2 right-auto',
      },
    ],
  }),

  header: tv({
    base: 'border-b',
    variants: {
      variant: {
        default: 'border-neutral-200 bg-neutral-50',
        glass: 'border-logo-lime/30 bg-gradient-to-r from-light-yellow-1 to-white',
        transparent: 'border-white/10 bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }),

  footer: tv({
    base: 'border-t',
    variants: {
      variant: {
        default: 'border-neutral-200 bg-neutral-50',
        glass: 'border-logo-lime/30 bg-white',
        transparent: 'border-white/10 bg-transparent',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }),

  body: tv({
    base: 'overflow-y-auto',
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
      maxHeight: {
        default: 'max-h-[calc(80vh-100px)]',
        sm: 'max-h-[200px]',
        md: 'max-h-[300px]',
        lg: 'max-h-[400px]',
        xl: 'max-h-[500px]',
        none: '',
      },
      glass: {
        true: 'bg-white',
        false: 'bg-white',
      },
    },
    defaultVariants: {
      padding: 'md',
      maxHeight: 'default',
      glass: false,
    },
  }),
};

/**
 * Simplified Menu component
 */
function Menu(props) {
  const {
    variant = 'dropdown',
    isMobile = false,
    isNavbarMobile = false,
    isOpen: controlledIsOpen,
    onClose,
    onToggle,
    onOpenChange,
    trigger,
    children,
    glass = false,
    position = 'right',
    rounded = 'default',
    header,
    footer,
    headerVariant = glass ? 'glass' : 'default',
    footerVariant = glass ? 'glass' : 'default',
    headerPadding = 'md',
    footerPadding = 'md',
    bodyPadding = 'md',
    maxHeight = 'default',
    menuProps = {},
    containerProps = {},
    containerClassName,
    className,
    menuId = `menu-${Math.random().toString(36).substr(2, 9)}`,
    showCloseButton = true,
  } = props;

  // State management
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);

  // Set up portal container for mobile navbar menus
  useEffect(() => {
    if (isNavbarMobile) {
      let container = document.getElementById('mobile-menu-portal');
      if (!container) {
        container = document.createElement('div');
        container.id = 'mobile-menu-portal';
        container.className = 'fixed inset-0 pointer-events-none z-[190]';
        document.body.appendChild(container);
      }
      setPortalContainer(container);
    }
  }, [isNavbarMobile]);

  // Listen for global menu changes
  useEffect(() => {
    const unregister = globalMenuTracker.registerListener((activeId) => {
      if (activeId !== menuId && isOpen) {
        if (onToggle) {
          onToggle(false);
        } else {
          setInternalIsOpen(false);
        }
        if (onClose) onClose();
      }
    });
    return unregister;
  }, [menuId, isOpen, onToggle, onClose]);

  // Synchronize with controlled isOpen prop
  useEffect(() => {
    if (controlledIsOpen !== undefined && onOpenChange) {
      onOpenChange(controlledIsOpen);
    }
  }, [controlledIsOpen, onOpenChange]);

  // Event handlers
  const handleToggle = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const newIsOpen = !isOpen;
    if (newIsOpen) {
      globalMenuTracker.setActiveMenu(menuId);
    }

    if (onToggle) {
      onToggle(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }

    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

  const handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (onToggle) {
      onToggle(false);
    } else {
      setInternalIsOpen(false);
    }

    if (onOpenChange) {
      onOpenChange(false);
    }

    if (onClose) onClose();
  };

  // Render header content
  const renderHeader = () => {
    if (!header) return null;

    return (
      <div className={`${styles.header({ variant: headerVariant, padding: headerPadding })} relative`}>
        {typeof header === 'function' ? header() : header}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-logo-lime/20 hover:bg-logo-lime/30 text-dark-green-7 border border-logo-lime/30 shadow-sm transition-colors"
            aria-label="Close menu"
          >
            <Icon name="x" size="sm" />
          </button>
        )}
      </div>
    );
  };

  // Render footer content
  const renderFooter = () => {
    if (!footer) return null;

    return (
      <div className={styles.footer({ variant: footerVariant, padding: footerPadding })}>
        {typeof footer === 'function' ? footer() : footer}
      </div>
    );
  };

  // Render body content
  const renderBody = () => {
    return (
      <div className={styles.body({ padding: bodyPadding, maxHeight, glass })}>
        {typeof children === 'function' ? children({ isOpen }) : children}
      </div>
    );
  };

  // Create menu content
  const menuContent = (
    <div
      className={`${styles.container({
        variant,
        position,
        glass,
        rounded,
        isMobile,
        isNavbarMobile,
        className: containerClassName
      })} ${isNavbarMobile ? 'navbar-dropdown-container animate-dropdown z-110' : ''}`}
      onClick={(e) => e.stopPropagation()}
      {...(containerProps || {})}
    >
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </div>
  );

  // Remove React-specific props from DOM elements
  const safeMenuProps = { ...menuProps };
  ['isOpen', 'onClose', 'onToggle', 'onOpenChange'].forEach(prop => {
    if (prop in safeMenuProps) delete safeMenuProps[prop];
  });

  // Render trigger with enhanced props
  const renderTrigger = () => {
    if (!trigger) return null;

    return React.cloneElement(trigger, {
      onClick: handleToggle,
      "data-menu-id": menuId,
      "data-state": isOpen ? "open" : "closed",
      "aria-expanded": isOpen,
      ref: (el) => { triggerRef.current = el; }
    });
  };

  return (
    <div
      ref={menuRef}
      className={styles.menu({ variant, isMobile, isNavbarMobile, className })}
      {...safeMenuProps}
      data-state={isOpen ? "open" : "closed"}
    >
      {renderTrigger()}
      {isOpen && (
        isNavbarMobile && portalContainer
          ? createPortal(menuContent, portalContainer)
          : menuContent
      )}
    </div>
  );
}

// Create subcomponents with safe prop handling
Menu.Header = function MenuHeader({ children, variant, padding, className, ...props }) {
  const safeProps = { ...props };
  if ('isOpen' in safeProps) delete safeProps.isOpen;

  return (
    <div className={styles.header({ variant, padding, className })} {...safeProps}>
      {children}
    </div>
  );
};

Menu.Footer = function MenuFooter({ children, variant, padding, className, ...props }) {
  const safeProps = { ...props };
  if ('isOpen' in safeProps) delete safeProps.isOpen;

  return (
    <div className={styles.footer({ variant, padding, className })} {...safeProps}>
      {children}
    </div>
  );
};

Menu.Body = function MenuBody({ children, padding, maxHeight, glass, className, ...props }) {
  const safeProps = { ...props };
  if ('isOpen' in safeProps) delete safeProps.isOpen;

  return (
    <div className={styles.body({ padding, maxHeight, glass, className })} {...safeProps}>
      {children}
    </div>
  );
};

export default Menu;