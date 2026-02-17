import React from 'react';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from './ProfileForm';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { prenom: true, nom: true },
    });

    if (!dbUser) {
        redirect('/login');
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-dark-bg">Mon Profil</h1>
            <ProfileForm
                email={user.email || ''}
                prenom={dbUser.prenom}
                nom={dbUser.nom}
            />
        </div>
    );
}
