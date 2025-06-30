import React from 'react';
import Icon from './Icon';
import { tv } from 'tailwind-variants';

const socialIconStyles = tv({
  base: 'inline-flex items-center justify-center transition-all',
  variants: {
    variant: {
      default: '',
      circle: 'rounded-full p-2',
      square: 'rounded p-2',
    },
    color: {
      brand: '', // Uses brand colors
      monochrome: 'text-neutral-700 hover:text-neutral-900',
      white: 'text-white hover:text-white/80',
      green: 'text-dark-green-6 hover:text-dark-green-7',
    }
  },
  defaultVariants: {
    variant: 'default',
    color: 'brand',
  },
});

/**
 * SocialIcon component for social media links
 *
 * @param {string} network - Social network name
 * @param {string} variant - Visual variant (default, circle, square)
 * @param {string} color - Color scheme (brand, monochrome, white, green)
 * @param {string} size - Size variant (sm, md, lg)
 * @param {string} className - Additional CSS classes
 */
export default function SocialIcon({
  network,
  variant,
  color,
  size = 'md',
  className,
  ...props
}) {
  // Map social networks to appropriate icons and brand colors
  const socialNetworks = {
    facebook: {
      icon: 'FacebookLogo',
      brandColor: 'text-[#1877F2] hover:text-[#0E65D9]',
    },
    twitter: {
      icon: 'TwitterLogo',
      brandColor: 'text-[#1DA1F2] hover:text-[#0C8BD9]',
    },
    instagram: {
      icon: 'InstagramLogo',
      brandColor: 'text-[#E4405F] hover:text-[#D62E50]',
    },
    linkedin: {
      icon: 'LinkedinLogo',
      brandColor: 'text-[#0A66C2] hover:text-[#0959AB]',
    },
    youtube: {
      icon: 'YoutubeLogo',
      brandColor: 'text-[#FF0000] hover:text-[#D90000]',
    },
    pinterest: {
      icon: 'PinterestLogo',
      brandColor: 'text-[#BD081C] hover:text-[#9E0717]',
    },
    tiktok: {
      icon: 'TiktokLogo',
      brandColor: 'text-[#000000] hover:text-[#333333]',
    },
    whatsapp: {
      icon: 'WhatsappLogo',
      brandColor: 'text-[#25D366] hover:text-[#20BD5A]',
    },
    telegram: {
      icon: 'TelegramLogo',
      brandColor: 'text-[#26A5E4] hover:text-[#2295CF]',
    },
    email: {
      icon: 'Envelope',
      brandColor: 'text-neutral-700 hover:text-neutral-900',
    },
    website: {
      icon: 'Globe',
      brandColor: 'text-neutral-700 hover:text-neutral-900',
    },
    phone: {
      icon: 'Phone',
      brandColor: 'text-neutral-700 hover:text-neutral-900',
    },
  };

  const socialInfo = socialNetworks[network.toLowerCase()] || {
    icon: 'Globe',
    brandColor: 'text-neutral-700 hover:text-neutral-900'
  };

  // Apply brand color if color variant is 'brand'
  const brandColorClass = color === 'brand' ? socialInfo.brandColor : '';

  return (
    <span
      className={`${socialIconStyles({ variant, color })} ${brandColorClass} ${className || ''}`}
    >
      <Icon
        name={socialInfo.icon}
        size={size}
        weight="fill"
        {...props}
      />
    </span>
  );
}