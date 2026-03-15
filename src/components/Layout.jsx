import Header from './layout/Header';
import MobileNav from './layout/MobileNav';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
