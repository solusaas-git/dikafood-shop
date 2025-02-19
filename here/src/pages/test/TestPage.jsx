import React from "react";
import {
    Carousel,
    // CarouselContent,
    // CarouselItem,
    // CarouselNext,
    // CarouselPrevious,
} from "../../components/ui/carousel";
import ProductCard from "../../components/cards/product/ProductCard";
import "./test-page.scss";

const PRODUCTS = [
    {
        id: 1,
        brand: "Dika Food",
        name: "Huile d'Olive Extra Vierge Premium",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Premium",
        price: "29.99€",
        variants: [
            { size: "500ml", price: "29.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Premium+500ml" },
            { size: "750ml", price: "39.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Premium+750ml" },
            { size: "1L", price: "49.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Premium+1L" },
        ]
    },
    {
        id: 2,
        brand: "Dika Food",
        name: "Huile d'Olive Extra Vierge Classique",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Classique",
        price: "24.99€",
        variants: [
            { size: "500ml", price: "24.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Classique+500ml" },
            { size: "750ml", price: "34.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Classique+750ml" },
            { size: "1L", price: "44.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Classique+1L" },
        ]
    },
    {
        id: 3,
        brand: "Dika Food",
        name: "Huile de Tournesol BioNature",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=BioNature",
        price: "19.99€",
        variants: [
            { size: "500ml", price: "19.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=BioNature+500ml" },
            { size: "750ml", price: "29.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=BioNature+750ml" },
            { size: "1L", price: "39.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=BioNature+1L" },
        ]
    },
    {
        id: 4,
        brand: "Dika Food",
        name: "Huile de Grignons d'Olive",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Grignons",
        price: "14.99€",
        variants: [
            { size: "500ml", price: "14.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Grignons+500ml" },
            { size: "750ml", price: "24.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Grignons+750ml" },
            { size: "1L", price: "34.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Grignons+1L" },
        ]
    },
    {
        id: 5,
        brand: "Dika Food",
        name: "Huile d'Argan Bio",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Argan",
        price: "34.99€",
        variants: [
            { size: "250ml", price: "34.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Argan+250ml" },
            { size: "500ml", price: "59.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Argan+500ml" },
            { size: "750ml", price: "79.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Argan+750ml" },
        ]
    },
    {
        id: 6,
        brand: "Dika Food",
        name: "Huile de Sésame Premium",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Sesame",
        price: "22.99€",
        variants: [
            { size: "250ml", price: "22.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Sesame+250ml" },
            { size: "500ml", price: "39.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Sesame+500ml" },
            { size: "750ml", price: "54.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Sesame+750ml" },
        ]
    },
    {
        id: 7,
        brand: "Dika Food",
        name: "Huile de Noix Artisanale",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noix",
        price: "27.99€",
        variants: [
            { size: "250ml", price: "27.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noix+250ml" },
            { size: "500ml", price: "47.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noix+500ml" },
            { size: "750ml", price: "64.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noix+750ml" },
        ]
    },
    {
        id: 8,
        brand: "Dika Food",
        name: "Huile de Pépins de Raisin",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Raisin",
        price: "18.99€",
        variants: [
            { size: "500ml", price: "18.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Raisin+500ml" },
            { size: "750ml", price: "26.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Raisin+750ml" },
            { size: "1L", price: "32.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Raisin+1L" },
        ]
    },
    {
        id: 9,
        brand: "Dika Food",
        name: "Huile de Colza Bio",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Colza",
        price: "16.99€",
        variants: [
            { size: "500ml", price: "16.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Colza+500ml" },
            { size: "750ml", price: "23.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Colza+750ml" },
            { size: "1L", price: "29.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Colza+1L" },
        ]
    },
    {
        id: 10,
        brand: "Dika Food",
        name: "Huile de Noisette Gourmet",
        image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noisette",
        price: "31.99€",
        variants: [
            { size: "250ml", price: "31.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noisette+250ml" },
            { size: "500ml", price: "54.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noisette+500ml" },
            { size: "750ml", price: "74.99€", image: "https://placehold.co/400x400/FFF5E0/1C1C1C?text=Noisette+750ml" },
        ]
    }
];

const TestPage = () => {
    const [activeVariants, setActiveVariants] = React.useState(
        PRODUCTS.reduce((acc, product) => ({
            ...acc,
            [product.id]: product.variants[0]
        }), {})
    );

    const handleVariantChange = (productId, variant) => {
        setActiveVariants(prev => ({
            ...prev,
            [productId]: variant
        }));
    };

    return (
        <div className="min-h-screen bg-background py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-16">
                        {/* Product Carousel */}
                        <section className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-foreground mb-2">Nos Produits</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Découvrez notre gamme d'huiles de première qualité, soigneusement sélectionnées pour leur excellence.
                                </p>
                            </div>

                            <div className="relative px-4 md:px-8">
                                <Carousel 
                                    opts={{
                                        loop: true,
                                        align: "start",
                                        slides: {
                                            perView: 1,
                                            spacing: 24
                                        },
                                        breakpoints: {
                                            "(min-width: 640px)": {
                                                slides: {
                                                    perView: 2,
                                                    spacing: 24
                                                }
                                            },
                                            "(min-width: 768px)": {
                                                slides: {
                                                    perView: 3,
                                                    spacing: 24
                                                }
                                            },
                                            "(min-width: 1024px)": {
                                                slides: {
                                                    perView: 4,
                                                    spacing: 24
                                                }
                                            }
                                        }
                                    }}
                                    className="w-full"
                                >
                                    {/* <CarouselContent>
                                        {PRODUCTS.map((product) => (
                                            <CarouselItem key={product.id} className="md:basis-[280px]">
                                                <ProductCard
                                                    product={product}
                                                    activeVariant={activeVariants[product.id]}
                                                    onVariantChange={(variant) => handleVariantChange(product.id, variant)}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext /> */}
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