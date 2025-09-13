'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContextNew'
import { CartProvider } from '@/contexts/CartContext'
import { PendingActionProvider } from '@/contexts/PendingActionContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LoadingProvider } from '@/contexts/LoadingContext'
import { I18nProvider } from '@/utils/i18n'
import NotificationManager from '@/components/ui/feedback/NotificationManager'
import { initializeTranslations } from '@/translations'

// Initialize translations
initializeTranslations();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider defaultLocale="fr">
      <NotificationProvider>
        <LoadingProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <PendingActionProvider>
                  {children}
                  <NotificationManager position="bottomCenter" />
                </PendingActionProvider>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </LoadingProvider>
      </NotificationProvider>
    </I18nProvider>
  )
}
