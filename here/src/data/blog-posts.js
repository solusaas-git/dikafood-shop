import articleImage1 from '../../images/articles/article-1.jpg';
import articleImage2 from '../../images/articles/article-2.jpg';
import articleImage3 from '../../images/articles/article-3.jpg';
import articleImage4 from '../../images/articles/article-4.jpg';
import articleImage5 from '../../images/articles/article-5.jpg';
import articleImage6 from '../../images/articles/article-6.jpg';

export const blogPosts = [
    {
        id: 'bienfaits-huile-olive',
        title: "Les bienfaits de l'huile d'olive pour la santé",
        excerpt: "Découvrez pourquoi l'huile d'olive est considérée comme un super aliment et ses nombreux bienfaits pour votre santé.",
        content: `
            <p>L'huile d'olive est reconnue depuis des millénaires pour ses propriétés bénéfiques...</p>
            <!-- Add more HTML content here -->
        `,
        category: "Santé",
        date: "15 Mars 2024",
        readTime: "5 min",
        author: "Sarah Martin",
        image: articleImage1
    },
    {
        id: 'recolte-traditionnelle',
        title: "La récolte traditionnelle des olives",
        excerpt: "Un voyage au cœur de nos traditions de récolte, où savoir-faire ancestral et qualité se rencontrent.",
        content: `
            <p>La récolte des olives est un moment crucial qui détermine la qualité de l'huile...</p>
        `,
        category: "Tradition",
        date: "10 Mars 2024",
        readTime: "4 min",
        author: "Jean Dupont",
        image: articleImage2
    },
    {
        id: 'cuisine-mediterraneenne',
        title: "L'huile d'olive dans la cuisine méditerranéenne",
        excerpt: "Explorez les secrets de la cuisine méditerranéenne et le rôle central de l'huile d'olive.",
        content: `
            <p>La cuisine méditerranéenne est reconnue mondialement pour ses bienfaits sur la santé...</p>
        `,
        category: "Cuisine",
        date: "5 Mars 2024",
        readTime: "6 min",
        author: "Marie Laurent",
        image: articleImage3
    },
    {
        id: 'production-durable',
        title: "Notre engagement pour une production durable",
        excerpt: "Comment nous produisons une huile d'olive de qualité tout en respectant l'environnement.",
        content: `
            <p>La durabilité est au cœur de notre processus de production...</p>
        `,
        category: "Environnement",
        date: "1 Mars 2024",
        readTime: "4 min",
        author: "Pierre Dubois",
        image: articleImage4
    },
    {
        id: 'selection-huile',
        title: "Comment choisir son huile d'olive",
        excerpt: "Guide pratique pour sélectionner la meilleure huile d'olive selon vos besoins.",
        content: `
            <p>Choisir la bonne huile d'olive peut sembler complexe avec toutes les options disponibles...</p>
        `,
        category: "Guide",
        date: "25 Février 2024",
        readTime: "7 min",
        author: "Sophie Bernard",
        image: articleImage5
    },
    {
        id: 'histoire-olive',
        title: "L'histoire millénaire de l'olivier",
        excerpt: "Un voyage dans le temps pour découvrir l'histoire fascinante de l'olivier et son importance culturelle.",
        content: `
            <p>L'olivier est un arbre mythique qui accompagne l'humanité depuis des millénaires...</p>
        `,
        category: "Histoire",
        date: "20 Février 2024",
        readTime: "5 min",
        author: "Marc Antoine",
        image: articleImage6
    }
]; 