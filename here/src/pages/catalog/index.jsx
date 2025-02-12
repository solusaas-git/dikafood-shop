import { memo } from 'react';
import CatalogCover from '../../components/catalog/CatalogCover';
// import Footer from '../../sections/shared/footer/Footer';

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