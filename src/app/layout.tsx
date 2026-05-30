import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { SettingsProvider } from '@/context/SettingsContext';

export const metadata: Metadata = {
  title: 'Trust Nest',
  description: 'Community Savings Platform',
  icons: {
    icon: '/images/trust-nest-logo.png',
    apple: '/images/trust-nest-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ToastProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
