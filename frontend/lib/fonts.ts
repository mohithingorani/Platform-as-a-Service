import localFont from 'next/font/local';

export const domaineMedium = localFont({
  src: '../public/fonts/domaine_medium.woff2',
  variable: '--font-domaine-medium',
  weight: '500', // Medium is typically 500
  // Optional: add display swap for better performance
  display: 'swap',
});