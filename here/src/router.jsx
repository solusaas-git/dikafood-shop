import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/home';
import CatalogPage from './pages/catalog';
import About from './pages/about/About';
import History from './pages/history/History';
import Values from './pages/values/Values';
import Blog from './pages/blog/Blog';
import TestPage from './pages/test/TestPage';
import NotFound from './pages/not-found/NotFound';
import Showcase from './pages/Showcase';
import Article from './pages/blog/Article';

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