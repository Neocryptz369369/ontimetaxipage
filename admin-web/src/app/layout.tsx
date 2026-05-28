import './globals.css';
export const metadata = { title: 'On Time Taxi — Admin', description: 'Operations dashboard' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
