import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContextNew';
import { CartProvider } from '@/contexts/CartContext';
import { PendingActionProvider } from '@/contexts/PendingActionContext';
import { I18nProvider } from '@/utils/i18n';
import AppRoutes from '@/router/routes';
import NotificationManager from '@/components/ui/feedback/NotificationManager';

/**
 * 🚀 App Component - Clean Integration Ready
 * Updated to use the new clean API service and contexts
 */
function App() {
  return (
    <I18nProvider defaultLocale="fr">
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <PendingActionProvider>
              <div className="App">
                <AppRoutes />
                <NotificationManager position="bottomCenter" />
              </div>
            </PendingActionProvider>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </I18nProvider>
  );
}

export default App;