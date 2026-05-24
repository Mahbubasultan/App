import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { SettingsProvider } from '@/context/SettingsContext';

export const metadata: Metadata = {
  title: 'Community Savings App',
  description: 'Digital ROSCA System',
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
