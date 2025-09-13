import React from 'react';
import { tv } from 'tailwind-variants';
import { Section } from '../layout';

// Styles for the form section using tailwind-variants
const styles = {
  container: tv({
    base: `
      flex w-full max-w-[var(--section-max-width)]
      bg-gradient-to-br from-white to-light-yellow-1
      backdrop-blur-xl rounded-3xl border border-dark-yellow-1
      overflow-hidden relative z-10 shadow-sm
    `,
    variants: {
      responsive: {
        mobile: 'flex-col',
        desktop: 'flex-row',
      },
      fullWidth: {
        true: 'w-full',
        false: 'max-w-2xl',
      }
    },
    defaultVariants: {
      responsive: 'desktop',
      fullWidth: true,
    }
  }),

  heroSide: tv({
    base: `
      flex-1 min-w-[550px] p-12 bg-[rgba(255,253,244,0.98)]
      relative flex justify-center items-center z-10
      before:content-[''] before:absolute before:inset-0
      before:bg-gradient-to-br before:from-light-yellow-1/30
      before:to-light-yellow-2/30 before:pointer-events-none
    `,
    variants: {
      responsive: {
        mobile: 'p-8 min-w-0',
        desktop: 'p-12 min-w-[550px]',
      }
    },
    defaultVariants: {
      responsive: 'desktop',
    }
  }),

  formSide: tv({
    base: `
      w-[480px] p-12 bg-gradient-to-br
      from-light-yellow-2 to-light-yellow-1
      relative z-20 border-l border-dark-yellow-1
      backdrop-blur-xl
    `,
    variants: {
      responsive: {
        mobile: 'w-full p-8 border-l-0 border-t border-t-dark-yellow-1',
        desktop: 'w-[480px] p-12 border-l border-l-dark-yellow-1',
      },
      sizeVariant: {
        small: 'lg:w-[400px]',
        medium: 'lg:w-[480px]',
        large: 'lg:w-[550px]',
      }
    },
    defaultVariants: {
      responsive: 'desktop',
      sizeVariant: 'medium',
    }
  }),

  formWrapper: 'relative z-20 w-full',

  formHeader: 'mb-8 text-center flex flex-col items-center gap-3',

  iconWrapper: `
    w-12 h-12 rounded-xl bg-white flex items-center
    justify-center text-dark-green-7 border
    border-dark-yellow-1 shadow-sm
  `,
};

/**
 * FormSection component - A reusable form section with a hero side and form side
 *
 * @param {string} id - The ID of the section
 * @param {React.ReactNode} heroContent - Content for the hero side of the form
 * @param {React.ReactNode} formContent - Content for the form side
 * @param {string} background - Background style for the section
 * @param {string} formTitle - Title of the form
 * @param {string} formDescription - Description of the form
 * @param {React.ReactNode} formIcon - Icon for the form
 * @param {boolean} showHeroSide - Whether to show the hero side
 * @param {string} sizeVariant - Size variant for the form side (small, medium, large)
 * @param {object} sectionProps - Additional props for the Section component
 */
export default function FormSection({
  id,
  heroContent,
  formContent,
  background = 'light-yellow-1',
  formTitle,
  formDescription,
  formIcon,
  showHeroSide = true,
  sizeVariant = 'medium',
  sectionProps = {},
}) {
  // Determine if we're in mobile view based on whether hero side is shown
  // This is just an initial value - actual responsive behavior is handled by CSS
  const isMobile = !showHeroSide;

  return (
    <Section
      id={id}
      background={background}
      padding="large"
      centered={true}
      {...sectionProps}
    >
      <div className={styles.container({
        responsive: isMobile ? 'mobile' : 'desktop',
      })}>
        {/* Hero side (e.g., for image, catalog preview, etc.) */}
        {showHeroSide && (
          <div className={styles.heroSide({
            responsive: isMobile ? 'mobile' : 'desktop',
          })}>
            {heroContent}
          </div>
        )}

        {/* Form side */}
        <div className={styles.formSide({
          responsive: isMobile ? 'mobile' : 'desktop',
          sizeVariant,
        })}>
          <div className={styles.formWrapper}>
            {/* Form header */}
            {(formTitle || formDescription || formIcon) && (
              <div className={styles.formHeader}>
                {formIcon && (
                  <div className={styles.iconWrapper}>
                    {formIcon}
                  </div>
                )}
                {formTitle && (
                  <h3 className="text-2xl text-dark-green-7 font-semibold">{formTitle}</h3>
                )}
                {formDescription && (
                  <p className="text-sm text-dark-green-6 leading-normal">{formDescription}</p>
                )}
              </div>
            )}

            {/* Form content passed as prop */}
            {formContent}
          </div>
        </div>
      </div>
    </Section>
  );
}