import React, { useCallback, useEffect, useState } from 'react';
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import useEmblaCarousel from 'embla-carousel-react';
import { CarouselNavButton } from '../Button/Button';
import './carousel.scss';

/**
 * Carousel Component - Base carousel with configurable options
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Carousel slides
 * @param {Object} [props.opts={}] - Embla carousel options
 * @param {string} [props.variant=''] - Carousel variant: 'product', etc.
 * @param {boolean} [props.showControls=true] - Whether to show navigation controls
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function Carousel({
  children,
  opts = {
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps'
  },
  variant = '',
  showControls = true,
  className = '',
  ...props
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(opts);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const carouselClasses = [
    'carousel',
    variant && `carousel--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={carouselClasses} {...props}>
      <div className="carousel__viewport" ref={emblaRef}>
        <div className="carousel__container">
          {children}
        </div>
      </div>

      {showControls && (
        <>
          <CarouselNavButton
            direction="prev"
            icon={<CaretLeft weight="bold" />}
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
          />
          <CarouselNavButton
            direction="next"
            icon={<CaretRight weight="bold" />}
            onClick={scrollNext}
            disabled={nextBtnDisabled}
          />
        </>
      )}
    </div>
  );
}

/**
 * Carousel Slide - Individual slide component
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - Slide content
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function CarouselSlide({ children, className = '', ...props }) {
  const slideClasses = [
    'carousel__slide',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={slideClasses} {...props}>
      {children}
    </div>
  );
}

/**
 * Product Carousel - Specialized carousel for product display
 *
 * @param {Object} props - The component props
 * @param {Array} props.products - Array of product data
 * @param {Function} props.renderProduct - Function to render a product
 * @param {Object} [props.options={}] - Carousel options
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function ProductCarousel({
  products,
  renderProduct,
  options = {},
  className = '',
  ...props
}) {
  const defaultOpts = {
    loop: true,
    align: 'center',
    dragFree: true,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 1024px)': { slidesToShow: 3 },
      '(min-width: 768px)': { slidesToShow: 2 },
      '(max-width: 767px)': {
        slidesToShow: 1,
        containScroll: true
      }
    }
  };

  const carouselOpts = { ...defaultOpts, ...options };

  return (
    <Carousel
      opts={carouselOpts}
      variant="product"
      className={className}
      {...props}
    >
      {products.map((product) => (
        <CarouselSlide key={product.id} data-type="product">
          {renderProduct(product)}
        </CarouselSlide>
      ))}
    </Carousel>
  );
}