import React, { useCallback, useEffect, useState } from 'react'
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import useEmblaCarousel from 'embla-carousel-react'
import './carousel.scss'

export function Carousel({ 
    children, 
    opts = { 
        loop: true,
        align: 'start',
        containScroll: 'trimSnaps'
    }, 
    className = "",
    showControls = true,
    ...props 
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel(opts)
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    return (
        <div className={`embla ${className}`} {...props}>
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {children}
                </div>
            </div>
            
            {showControls && (
                <>
                    <button
                        className="embla__button embla__button--prev"
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                        aria-label="Previous slide"
                    >
                        <CaretLeft weight="bold" />
                    </button>
                    <button
                        className="embla__button embla__button--next"
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                        aria-label="Next slide"
                    >
                        <CaretRight weight="bold" />
                    </button>
                </>
            )}
        </div>
    )
}

export function CarouselSlide({ children, className = "", ...props }) {
    return (
        <div className={`embla__slide ${className}`} {...props}>
            {children}
        </div>
    )
}
