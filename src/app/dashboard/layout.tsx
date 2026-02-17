import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user details from Prisma
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { prenom: true, nom: true },
    });

    const userName = dbUser ? `${dbUser.prenom} ${dbUser.nom}` : 'Utilisateur';

    return (
        <div className="flex min-h-screen bg-light-bg">
            {/* Sidebar fixe */}
            <Sidebar />

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col ml-64">
                {/* Topbar fixe */}
                <Topbar userName={userName} />

                {/* Zone de contenu défilante */}
                <main className="flex-1 mt-16 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
