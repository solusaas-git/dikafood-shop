import { memo } from 'react';
import CatalogCover from '../Sections/CatalogCover';
// import Footer from '../Components/Footer';

const CatalogPage = memo(() => {
    return (
        <main className="catalog-page">
            <CatalogCover />
            {/* <Footer /> */}
        </main>
    );
});

CatalogPage.displayName = 'CatalogPage';

export default CatalogPage; 