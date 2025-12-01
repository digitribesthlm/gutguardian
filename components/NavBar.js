'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, UtensilsCrossed, GraduationCap, ShoppingBasket, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function NavBar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const linkClass = (path) =>
    `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200 ${
      pathname === path ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 z-50 md:top-0 md:h-screen md:w-20 md:flex-col md:border-t-0 md:border-r">
      <div className="flex flex-row md:flex-col justify-between items-center h-full w-full md:py-8">
        <div className="hidden md:block mb-8">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 font-bold text-xl">
            G
          </div>
        </div>

        <div className="flex md:flex-col w-full md:space-y-8 justify-around md:justify-start">
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span>Dash</span>
          </Link>
          <Link href="/journal" className={linkClass('/journal')}>
            <BookOpen className="w-6 h-6 mb-1" />
            <span>Journal</span>
          </Link>
          <Link href="/recipes" className={linkClass('/recipes')}>
            <UtensilsCrossed className="w-6 h-6 mb-1" />
            <span>Recipes</span>
          </Link>
          <Link href="/shopping" className={linkClass('/shopping')}>
            <ShoppingBasket className="w-6 h-6 mb-1" />
            <span>Shop</span>
          </Link>
          <Link href="/learn" className={linkClass('/learn')}>
            <GraduationCap className="w-6 h-6 mb-1" />
            <span>Learn</span>
          </Link>
        </div>

        <div className="hidden md:flex mt-auto">
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

