'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { LayoutDashboard, Zap, User, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client'; // Assuming client-side auth for logout
// Note: User asked for "utils/supabase/server.ts" earlier, check if we have a client version or should use server action for logout?
// For the button visual, we can just put a button. Logic can be added later or now.
// I will use a simple button for now, or maybe a server action if created?
// User asked to "Protéger la route" with middleware, so logout likely needs to clear cookie.
// Let's stick to UI first as requested, but maybe add an empty handleLogout or use router.

const navItems = [
    { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mes Consommations', href: '/dashboard/consommations', icon: Zap },
    { label: 'Profil', href: '/dashboard/profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-bg text-gray-300 flex flex-col z-50">
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
    );
}
