import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/home';
import Shop from './pages/shop/Shop';
import About from './pages/about/About';
import History from './pages/history/History';
import Values from './pages/values/Values';
import Blog from './pages/blog/Blog';
import Article from './pages/blog/Article';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import NotFound from './pages/not-found/NotFound';
import ProductDetail from './pages/product/ProductDetail';
import Checkout from './pages/checkout/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ColorsShowcase from './pages/showcase/ColorsShowcase';
import LimeColorTest from './pages/showcase/LimeColorTest';
import ColorSystemDemo from './pages/showcase/ColorSystemDemo';
import ProductCardsShowcase from './pages/showcase/ProductCardsShowcase';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'about',
                element: <About />
            },
            {
                path: 'history',
                element: <History />
            },
            {
                path: 'values',
                element: <Values />
            },
            {
                path: 'blog',
                element: <Blog />
            },
            {
                path: 'blog/:id',
                element: <Article />
            },
            {
                path: 'terms',
                element: <Terms />
            },
            {
                path: 'privacy',
                element: <Privacy />
            },
            {
                path: 'shop',
                element: <Shop />
            },
            {
                path: 'product/:productId',
                element: <ProductDetail />
            },
            {
                path: 'checkout',
                element: <Checkout />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: 'colors',
                element: <ColorsShowcase />
            },
            {
                path: 'lime-test',
                element: <LimeColorTest />
            },
            {
                path: 'color-system',
                element: <ColorSystemDemo />
            },
            {
                path: 'product-cards',
                element: <ProductCardsShowcase />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]);