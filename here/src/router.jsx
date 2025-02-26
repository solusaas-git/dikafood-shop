import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/home';
import CatalogPage from './pages/catalog';
import About from './pages/about/About';
import History from './pages/history/History';
import Values from './pages/values/Values';
import Blog from './pages/blog/Blog';
import Article from './pages/blog/Article';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import TestPage from './pages/test/TestPage';
import NotFound from './pages/not-found/NotFound';
import Showcase from './pages/Showcase';

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
                path: 'catalog',
                element: <CatalogPage />
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
                path: 'test',
                element: <TestPage />
            },
            {
                path: 'showcase',
                element: <Showcase />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]); 