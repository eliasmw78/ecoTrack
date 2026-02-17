'use client';

import React from 'react';
import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';

interface TopbarProps {
    userName: string;
}

export function Topbar({ userName }: TopbarProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-4 sm:px-8 fixed top-0 right-0 left-0 lg:left-64 z-30">
            <Link href="/dashboard/profile" className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500">Bonjour,</p>
                    <p className="font-semibold text-dark-bg">{userName}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-500">
                    <UserIcon size={20} />
                </div>
            </Link>
        </header>
    );
}
