'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { LayoutDashboard, Zap, User, LogOut, Menu, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const navItems = [
    { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mes Consommations', href: '/dashboard/consommations', icon: Zap },
    { label: 'Profil', href: '/dashboard/profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-bg text-white shadow-lg"
                aria-label="Ouvrir le menu"
            >
                <Menu size={22} />
            </button>

            {/* Overlay (mobile only) */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen w-64 bg-dark-bg text-gray-300 flex flex-col z-50
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {/* Close button (mobile) */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
                    aria-label="Fermer le menu"
                >
                    <X size={20} />
                </button>

                {/* Header Logo */}
                <div className="p-6">
                    <Logo variant="light" size="md" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 mt-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${isActive
                                    ? 'bg-white/10 text-eco-green'
                                    : 'hover:bg-white/5 hover:text-eco-green'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-eco-green' : 'group-hover:text-eco-green transition-colors'} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-alert-red hover:bg-alert-red/10 transition-colors"
                        onClick={async () => {
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            window.location.href = '/login';
                        }}
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
