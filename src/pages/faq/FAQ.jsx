import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CaretDown,
  CaretUp,
  ShoppingCart,
  Truck,
  CreditCard,
  Package,
  Leaf,
  Factory,
  Scales,
  User
} from "@phosphor-icons/react";
import './faq.scss';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import TranslatedText from '../../components/ui/text/TranslatedText';
import PageHeader from '../../components/ui/headers/PageHeader';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleQuestion = (categoryId, questionId) => {
    setExpandedQuestions(prev => {
      const key = `${categoryId}-${questionId}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  const isQuestionExpanded = (categoryId, questionId) => {
    const key = `${categoryId}-${questionId}`;
    return !!expandedQuestions[key];
  };

  // FAQ categories and questions
  const faqCategories = [
    {
      id: 'general',
      title: 'Questions générales',
      icon: <Leaf weight="duotone" />,
      questions: [
        {
          id: 'g1',
          question: "Qu'est-ce que DikaFood?",
          answer: "DikaFood est une entreprise marocaine spécialisée dans la production et la commercialisation de produits alimentaires traditionnels de haute qualité. Nous nous engageons à fournir des produits naturels, sans additifs, issus de méthodes de production respectueuses de l'environnement et des traditions culinaires marocaines."
        },
        {
          id: 'g2',
          question: "D'où viennent vos produits?",
          answer: "Nos produits sont principalement issus de différentes régions du Maroc, sélectionnées pour leurs caractéristiques uniques. Par exemple, notre huile d'olive provient des montagnes de l'Atlas, notre miel des forêts de thym du Moyen Atlas, et nos épices des marchés traditionnels des villes impériales. Nous travaillons directement avec des agriculteurs et des coopératives locales pour garantir la meilleure qualité."
        },
        {
          id: 'g3',
          question: "Vos produits sont-ils biologiques?",
          answer: "La plupart de nos produits sont cultivés selon des méthodes traditionnelles respectueuses de l'environnement. Bien que tous nos produits ne soient pas certifiés biologiques, nous garantissons qu'ils sont cultivés avec un minimum d'intervention chimique et dans le respect des écosystèmes locaux. Nous travaillons actuellement à l'obtention de certifications biologiques pour une plus grande partie de notre gamme."
        }
      ]
    },
    {
      id: 'products',
      title: 'Nos produits',
      icon: <Factory weight="duotone" />,
      questions: [
        {
          id: 'p1',
          question: "Comment sont fabriqués vos produits?",
          answer: "Nos produits sont fabriqués selon des méthodes traditionnelles, souvent transmises de génération en génération. Par exemple, notre huile d'olive est extraite par première pression à froid, notre miel est récolté et filtré de manière naturelle, et nos épices sont séchées au soleil et moulues à la pierre. Nous privilégions les méthodes qui préservent au maximum les saveurs et les nutriments."
        },
        {
          id: 'p2',
          question: "Quelle est la durée de conservation de vos produits?",
          answer: "La durée de conservation varie selon les produits. Notre huile d'olive peut se conserver jusqu'à 24 mois dans des conditions optimales, notre miel peut se conserver plusieurs années, et nos épices gardent leur arôme pendant environ 12 mois. Chaque produit comporte une date de durabilité minimale sur l'emballage. Pour une conservation optimale, nous recommandons de garder nos produits à l'abri de la lumière, de la chaleur et de l'humidité."
        },
        {
          id: 'p3',
          question: "Vos produits contiennent-ils des additifs ou conservateurs?",
          answer: "Non, nous nous engageons à proposer des produits 100% naturels, sans additifs, conservateurs, colorants ou arômes artificiels. Nos méthodes de production traditionnelles permettent de préserver les produits naturellement, sans avoir recours à des adjuvants chimiques."
        },
        {
          id: 'p4',
          question: "Proposez-vous des produits pour les régimes spécifiques (végétarien, végan, sans gluten)?",
          answer: "Oui, la plupart de nos produits conviennent aux végétariens et aux végans. Beaucoup sont également naturellement sans gluten, comme notre huile d'olive, notre miel et la plupart de nos épices. Toutefois, nous vous recommandons de consulter les informations détaillées sur chaque produit pour confirmer leur compatibilité avec votre régime alimentaire spécifique."
        }
      ]
    },
    {
      id: 'orders',
      title: 'Commandes et paiement',
      icon: <ShoppingCart weight="duotone" />,
      questions: [
        {
          id: 'o1',
          question: "Comment puis-je passer commande?",
          answer: "Vous pouvez passer commande directement sur notre site web. Il vous suffit de parcourir notre catalogue, d'ajouter les produits de votre choix à votre panier, puis de procéder au paiement en suivant les étapes indiquées. Vous recevrez ensuite une confirmation par email avec les détails de votre commande."
        },
        {
          id: 'o2',
          question: "Quelles sont les méthodes de paiement acceptées?",
          answer: "Nous acceptons plusieurs méthodes de paiement: cartes de crédit/débit (Visa, Mastercard), virement bancaire, et paiement à la livraison (pour certaines régions). Tous nos paiements en ligne sont sécurisés grâce à un système de cryptage avancé pour protéger vos informations personnelles."
        },
        {
          id: 'o3',
          question: "Puis-je modifier ou annuler ma commande après l'avoir passée?",
          answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation, à condition qu'elle n'ait pas encore été préparée pour expédition. Pour ce faire, connectez-vous à votre compte et accédez à la section 'Mes commandes', ou contactez notre service client par email ou téléphone."
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Livraison et retours',
      icon: <Truck weight="duotone" />,
      questions: [
        {
          id: 's1',
          question: "Quels sont les délais de livraison?",
          answer: "Les délais de livraison varient selon votre localisation. Pour les livraisons au Maroc, comptez généralement 2-3 jours ouvrables pour les grandes villes et 3-5 jours pour les zones rurales. Pour les livraisons internationales, les délais sont généralement de 5-10 jours ouvrables, selon le pays de destination et la méthode d'expédition choisie."
        },
        {
          id: 's2',
          question: "Livrez-vous à l'international?",
          answer: "Oui, nous livrons dans de nombreux pays à travers le monde. Les frais de livraison et les délais varient selon la destination. Veuillez consulter notre page 'Livraison' pour plus de détails sur les pays desservis et les tarifs applicables."
        },
        {
          id: 's3',
          question: "Quelle est votre politique de retour?",
          answer: "Si vous n'êtes pas satisfait de votre achat, vous pouvez retourner les produits non ouverts dans les 14 jours suivant leur réception. Les frais de retour sont à la charge du client, sauf en cas d'erreur de notre part ou de produit défectueux. Pour initier un retour, veuillez contacter notre service client avec votre numéro de commande et les détails du problème rencontré."
        },
        {
          id: 's4',
          question: "Comment sont emballés vos produits pour l'expédition?",
          answer: "Nous accordons une grande importance à l'emballage de nos produits pour garantir qu'ils arrivent en parfait état. Nos produits sont soigneusement emballés dans des matériaux écologiques et recyclables. Pour les produits fragiles comme les bouteilles d'huile d'olive, nous utilisons des protections supplémentaires pour éviter tout dommage pendant le transport."
        }
      ]
    },
    {
      id: 'account',
      title: 'Compte et confidentialité',
      icon: <User weight="duotone" />,
      questions: [
        {
          id: 'a1',
          question: "Comment créer un compte?",
          answer: "Créer un compte sur notre site est simple et rapide. Cliquez sur 'Mon Compte' en haut à droite de la page, puis sur 'Créer un compte'. Remplissez le formulaire avec vos informations personnelles et choisissez un mot de passe sécurisé. Vous recevrez ensuite un email de confirmation pour activer votre compte."
        },
        {
          id: 'a2',
          question: "Comment sont utilisées mes données personnelles?",
          answer: "Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Nous collectons uniquement les informations nécessaires pour traiter vos commandes et améliorer votre expérience sur notre site. Nous ne vendons jamais vos informations à des tiers. Pour plus de détails, veuillez consulter notre politique de confidentialité."
        },
        {
          id: 'a3',
          question: "Comment puis-je modifier mes informations personnelles?",
          answer: "Vous pouvez modifier vos informations personnelles à tout moment en vous connectant à votre compte et en accédant à la section 'Mes informations'. Là, vous pourrez mettre à jour votre adresse, vos coordonnées et vos préférences de communication."
        }
      ]
    },
    {
      id: 'quality',
      title: 'Qualité et certifications',
      icon: <Scales weight="duotone" />,
      questions: [
        {
          id: 'q1',
          question: "Quelles certifications possèdent vos produits?",
          answer: "Nos produits possèdent diverses certifications selon leur nature. Notre huile d'olive est certifiée Extra Vierge par les laboratoires officiels marocains. Certains de nos produits ont également obtenu des labels de qualité comme 'Appellation d'Origine Protégée' (AOP) ou 'Indication Géographique Protégée' (IGP). Nous travaillons continuellement à l'obtention de certifications internationales pour garantir la qualité de nos produits à l'échelle mondiale."
        },
        {
          id: 'q2',
          question: "Comment garantissez-vous la qualité de vos produits?",
          answer: "Nous assurons la qualité de nos produits à travers plusieurs mesures: 1) Sélection rigoureuse des matières premières et des fournisseurs; 2) Contrôles qualité à chaque étape de la production; 3) Tests en laboratoire pour vérifier la composition et l'absence de contaminants; 4) Suivi des conditions de stockage et d'emballage; 5) Formation continue de notre personnel aux bonnes pratiques. Nous sommes également en constante recherche d'amélioration de nos processus pour vous offrir les meilleurs produits possibles."
        },
        {
          id: 'q3',
          question: "Vos produits sont-ils testés?",
          answer: "Oui, tous nos produits sont soumis à des tests rigoureux avant d'être mis sur le marché. Nous effectuons des analyses sensorielles (goût, odeur, texture) ainsi que des analyses en laboratoire pour vérifier leur composition nutritionnelle et l'absence de contaminants ou de résidus. Ces tests sont réalisés par des laboratoires indépendants pour garantir leur objectivité."
        }
      ]
    },
  ];

  return (
    <div className="faq-page">
      <Helmet>
        <title>Foire Aux Questions | DikaFood</title>
        <meta name="description" content="Trouvez des réponses à toutes vos questions sur nos produits, commandes, livraisons et plus encore." />
      </Helmet>

      <NavBar />

      <PageHeader
        title="Foire Aux Questions"
        subtitle="Trouvez des réponses à vos questions concernant nos produits, commandes, livraisons et plus encore."
      />

      <div className="container">
        <div className="faq-search">
          <input
            type="text"
            placeholder="Rechercher une question..."
            className="search-input"
          />
        </div>

        <div className="faq-content">
          <div className="faq-categories">
            {faqCategories.map(category => (
              <button
                key={category.id}
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                <span>{category.title}</span>
              </button>
            ))}
          </div>

          <div className="faq-questions">
            {faqCategories.map(category => (
              <div
                key={category.id}
                className={`faq-category ${activeCategory === category.id ? 'active' : ''}`}
              >
                <h2 className="category-title">
                  {category.icon}
                  {category.title}
                </h2>

                <div className="questions-list">
                  {category.questions.map(question => (
                    <div
                      key={question.id}
                      className={`faq-item ${isQuestionExpanded(category.id, question.id) ? 'expanded' : ''}`}
                    >
                      <div
                        className="question-header"
                        onClick={() => toggleQuestion(category.id, question.id)}
                      >
                        <h3 className="question">{question.question}</h3>
                        {isQuestionExpanded(category.id, question.id) ? (
                          <CaretUp weight="bold" className="toggle-icon" />
                        ) : (
                          <CaretDown weight="bold" className="toggle-icon" />
                        )}
                      </div>

                      <div className="answer">
                        <p>{question.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-header">
            <h2>Vous n'avez pas trouvé de réponse à votre question?</h2>
            <p>Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.</p>
          </div>

          <form className="contact-form" onSubmit={(e) => {
            e.preventDefault();
            // Show success message (in a real app, this would send the form data to a server)
            setFormSubmitted(true);
            e.target.reset();
          }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <input type="text" id="name" name="name" required placeholder="Votre nom" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="Votre adresse email" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <select id="subject" name="subject" required>
                <option value="">Sélectionnez un sujet</option>
                <option value="product">Question sur un produit</option>
                <option value="order">Commande et livraison</option>
                <option value="return">Retours et remboursements</option>
                <option value="account">Compte client</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder="Détaillez votre question ici..."
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              Envoyer votre message
            </button>

            {formSubmitted && (
              <div className="success-message">
                <p>Merci pour votre message! Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;