import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "../../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const SLIDES = [
    {
        id: 1,
        image: "/images/products/huile-olive-extra-vierge-premium.png",
        title: "Huile d'Olive Extra Vierge Premium",
        description: "Notre huile d'olive premium, pressée à froid pour préserver sa saveur exceptionnelle.",
    },
    {
        id: 2,
        image: "/images/products/huile-olive-extra-vierge-classique.png",
        title: "Huile d'Olive Extra Vierge Classique",
        description: "Une huile d'olive pure et authentique, idéale pour la cuisine quotidienne.",
    },
    {
        id: 3,
        image: "/images/products/huile-tournesol-bionature.png",
        title: "Huile de Tournesol BioNature",
        description: "Huile de tournesol biologique, légère et polyvalente.",
    },
    {
        id: 4,
        image: "/images/products/huile-grignons-olive.png",
        title: "Huile de Grignons d'Olive",
        description: "Une alternative économique pour la cuisson à haute température.",
    },
];

const TestPage = () => {
    const [api, setApi] = React.useState(null);
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const carouselOptions = {
        align: "start",
        loop: true,
        skipSnaps: false,
        dragFree: false,
    };

    const autoplayPlugin = React.useMemo(
        () =>
            Autoplay({
                delay: 4000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
            }),
        []
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col gap-12">
                        {/* Basic Carousel */}
                        <section className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos Produits</h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Découvrez notre gamme d'huiles de première qualité, soigneusement sélectionnées pour leur excellence.
                                </p>
                            </div>

                            <div className="relative">
                                <Carousel
                                    opts={carouselOptions}
                                    plugins={[autoplayPlugin]}
                                    setApi={setApi}
                                    className="w-full"
                                >
                                    <CarouselContent>
                                        {SLIDES.map((slide) => (
                                            <CarouselItem key={slide.id} className="basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                                                <div className="slide-content">
                                                    <img
                                                        src={slide.image}
                                                        alt={slide.title}
                                                        className="aspect-[4/3] object-cover"
                                                    />
                                                    <h3>{slide.title}</h3>
                                                    <p>{slide.description}</p>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>

                                <div className="carousel-dots">
                                    {SLIDES.map((_, index) => (
                                        <button
                                            key={index}
                                            className={index === current ? "active" : ""}
                                            onClick={() => api?.scrollTo(index)}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Vertical Carousel */}
                        <section className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Vue Verticale</h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Une présentation alternative de nos produits en format vertical.
                                </p>
                            </div>

                            <div className="relative h-[600px]">
                                <Carousel
                                    opts={{ ...carouselOptions, axis: "y" }}
                                    orientation="vertical"
                                    className="h-full"
                                >
                                    <CarouselContent>
                                        {SLIDES.map((slide) => (
                                            <CarouselItem key={slide.id} className="basis-full pt-4">
                                                <div className="slide-content">
                                                    <img
                                                        src={slide.image}
                                                        alt={slide.title}
                                                        className="aspect-[4/3] object-cover"
                                                    />
                                                    <h3>{slide.title}</h3>
                                                    <p>{slide.description}</p>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPage; 