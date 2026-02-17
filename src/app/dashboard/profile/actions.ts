'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non authentifié' };
    }

    const prenom = (formData.get('prenom') as string)?.trim();
    const nom = (formData.get('nom') as string)?.trim();

    if (!prenom || prenom.length < 2) {
        return { error: 'Le prénom doit contenir au moins 2 caractères' };
    }

    if (!nom || nom.length < 2) {
        return { error: 'Le nom doit contenir au moins 2 caractères' };
    }

    // Validation basique anti-injection
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(prenom) || !nameRegex.test(nom)) {
        return { error: 'Les noms ne peuvent contenir que des lettres, espaces, apostrophes et tirets' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { prenom, nom },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (e) {
        console.error('Error updating profile:', e);
        return { error: 'Erreur lors de la mise à jour du profil' };
    }
}

export async function sendResetPasswordEmail() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return { error: 'Non authentifié' };
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        });

        if (error) {
            console.error('Password reset error:', error);
            return { error: 'Erreur lors de l\'envoi de l\'email' };
        }

        return { success: true };
    } catch (e) {
        console.error('Error sending reset email:', e);
        return { error: 'Erreur lors de l\'envoi de l\'email' };
    }
}
