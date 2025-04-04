import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/home';
import About from './pages/about/About';
import History from './pages/history/History';
import Values from './pages/values/Values';
import Blog from './pages/blog/Blog';
import Article from './pages/blog/Article';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import NotFound from './pages/not-found/NotFound';

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
                path: '*',
                element: <NotFound />
            }
        ]
    }
]); 