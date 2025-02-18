import * as React from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../lib/utils";
import "./_carousel.scss";

const Carousel = React.forwardRef(
    ({ opts, plugins, orientation = "horizontal", setApi, className, children, ...props }, ref) => {
        const [emblaRef, emblaApi] = useEmblaCarousel({
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y",
        }, plugins);

        const [canScrollPrev, setCanScrollPrev] = React.useState(false);
        const [canScrollNext, setCanScrollNext] = React.useState(false);

        const onSelect = React.useCallback((api) => {
            if (!api) return;

            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);

        React.useEffect(() => {
            if (!emblaApi) return;

            onSelect(emblaApi);
            emblaApi.on("select", onSelect);
            emblaApi.on("reInit", onSelect);

            if (setApi) {
                setApi(emblaApi);
            }

            return () => {
                emblaApi.off("select", onSelect);
                emblaApi.off("reInit", onSelect);
            };
        }, [emblaApi, onSelect, setApi]);

        return (
            <div ref={ref} className={cn("relative", className)} {...props}>
                <div ref={emblaRef} className="overflow-hidden">
                    {children}
                </div>
                {canScrollPrev && (
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollPrev()}
                        className="carousel-prev"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                )}
                {canScrollNext && (
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollNext()}
                        className="carousel-next"
                        aria-label="Next slide"
                    >
                        <ArrowRight className="h-6 w-6" />
                    </button>
                )}
            </div>
        );
    }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex", className)} {...props} />
));
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0", className)}
        {...props}
    />
));
CarouselItem.displayName = "CarouselItem";

export { Carousel, CarouselContent, CarouselItem }; 