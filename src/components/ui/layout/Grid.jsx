import React from 'react';
import { tv } from 'tailwind-variants';

// Styles for grid components
const containerStyles = tv({
  base: 'w-full',
  variants: {
    fluid: {
      true: 'px-4 md:px-6',
      false: 'container mx-auto px-4 md:px-6',
    },
    centered: {
      true: 'flex flex-col items-center',
      false: '',
    },
  },
  defaultVariants: {
    fluid: false,
    centered: false,
  },
});

const rowStyles = tv({
  base: 'flex flex-wrap -mx-4',
  variants: {
    gutter: {
      none: 'mx-0',
      xs: '-mx-1',
      sm: '-mx-2',
      md: '-mx-4',
      lg: '-mx-6',
      xl: '-mx-8',
    },
    justifyContent: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
  },
  defaultVariants: {
    gutter: 'md',
    justifyContent: 'start',
    alignItems: 'stretch',
  },
});

const colStyles = tv({
  base: 'px-4',
  variants: {
    gutter: {
      none: 'px-0',
      xs: 'px-1',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
      xl: 'px-8',
    },
    span: {
      auto: 'flex-1',
      1: 'w-1/12',
      2: 'w-2/12',
      3: 'w-3/12',
      4: 'w-4/12',
      5: 'w-5/12',
      6: 'w-6/12',
      7: 'w-7/12',
      8: 'w-8/12',
      9: 'w-9/12',
      10: 'w-10/12',
      11: 'w-11/12',
      12: 'w-full',
    },
    spanSm: {
      auto: 'sm:flex-1',
      1: 'sm:w-1/12',
      2: 'sm:w-2/12',
      3: 'sm:w-3/12',
      4: 'sm:w-4/12',
      5: 'sm:w-5/12',
      6: 'sm:w-6/12',
      7: 'sm:w-7/12',
      8: 'sm:w-8/12',
      9: 'sm:w-9/12',
      10: 'sm:w-10/12',
      11: 'sm:w-11/12',
      12: 'sm:w-full',
    },
    spanMd: {
      auto: 'md:flex-1',
      1: 'md:w-1/12',
      2: 'md:w-2/12',
      3: 'md:w-3/12',
      4: 'md:w-4/12',
      5: 'md:w-5/12',
      6: 'md:w-6/12',
      7: 'md:w-7/12',
      8: 'md:w-8/12',
      9: 'md:w-9/12',
      10: 'md:w-10/12',
      11: 'md:w-11/12',
      12: 'md:w-full',
    },
    spanLg: {
      auto: 'lg:flex-1',
      1: 'lg:w-1/12',
      2: 'lg:w-2/12',
      3: 'lg:w-3/12',
      4: 'lg:w-4/12',
      5: 'lg:w-5/12',
      6: 'lg:w-6/12',
      7: 'lg:w-7/12',
      8: 'lg:w-8/12',
      9: 'lg:w-9/12',
      10: 'lg:w-10/12',
      11: 'lg:w-11/12',
      12: 'lg:w-full',
    },
    spanXl: {
      auto: 'xl:flex-1',
      1: 'xl:w-1/12',
      2: 'xl:w-2/12',
      3: 'xl:w-3/12',
      4: 'xl:w-4/12',
      5: 'xl:w-5/12',
      6: 'xl:w-6/12',
      7: 'xl:w-7/12',
      8: 'xl:w-8/12',
      9: 'xl:w-9/12',
      10: 'xl:w-10/12',
      11: 'xl:w-11/12',
      12: 'xl:w-full',
    },
  },
  defaultVariants: {
    gutter: 'md',
    span: 12,
  },
});

/**
 * Grid.Container component
 *
 * @param {boolean} fluid - Whether the container should be fluid width
 * @param {boolean} centered - Whether to center the content
 * @param {React.ReactNode} children - Container content
 * @param {string} className - Additional CSS classes
 */
export function Container({
  fluid,
  centered,
  children,
  className,
  ...props
}) {
  return (
    <div className={containerStyles({ fluid, centered, className })} {...props}>
      {children}
    </div>
  );
}

/**
 * Grid.Row component
 *
 * @param {string} gutter - Gutter size (none, xs, sm, md, lg, xl)
 * @param {string} justifyContent - Horizontal alignment (start, center, end, between, around, evenly)
 * @param {string} alignItems - Vertical alignment (start, center, end, stretch, baseline)
 * @param {React.ReactNode} children - Row content
 * @param {string} className - Additional CSS classes
 */
export function Row({
  gutter,
  justifyContent,
  alignItems,
  children,
  className,
  ...props
}) {
  return (
    <div className={rowStyles({ gutter, justifyContent, alignItems, className })} {...props}>
      {children}
    </div>
  );
}

/**
 * Grid.Col component
 *
 * @param {string} gutter - Gutter size (none, xs, sm, md, lg, xl)
 * @param {number|string} span - Column span (1-12 or 'auto')
 * @param {number|string} spanSm - Column span for sm breakpoint
 * @param {number|string} spanMd - Column span for md breakpoint
 * @param {number|string} spanLg - Column span for lg breakpoint
 * @param {number|string} spanXl - Column span for xl breakpoint
 * @param {React.ReactNode} children - Column content
 * @param {string} className - Additional CSS classes
 */
export function Col({
  gutter,
  span,
  spanSm,
  spanMd,
  spanLg,
  spanXl,
  children,
  className,
  ...props
}) {
  return (
    <div
      className={colStyles({
        gutter,
        span,
        spanSm,
        spanMd,
        spanLg,
        spanXl,
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
}

// Grid component with subcomponents
const Grid = {
  Container,
  Row,
  Col,
};

export default Grid;