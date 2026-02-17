'use server';

import prisma from '@/lib/prisma';

export async function getEnergyTypes() {
    try {
        const types = await prisma.typeEnergie.findMany({
            select: {
                id: true,
                libelle: true,
                unite: true,
            },
            orderBy: {
                libelle: 'asc',
            },
        });
        return types;
    } catch (error) {
        console.error('Error fetching energy types:', error);
        return [];
    }
}

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addConsumption(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non authentifié' };
    }

    const dateStr = formData.get('date') as string;
    const valeurStr = formData.get('valeur') as string;
    const coutStr = formData.get('cout') as string;
    const typeIdStr = formData.get('typeId') as string;

    const date = new Date(dateStr);
    const valeur = parseFloat(valeurStr);
    const cout = coutStr ? parseFloat(coutStr) : 0;
    const typeId = parseInt(typeIdStr);

    if (isNaN(valeur) || valeur <= 0) {
        return { error: 'La valeur doit être positive' };
    }

    if (isNaN(cout) || cout < 0) {
        return { error: 'Le montant doit être positif' };
    }

    if (!date || isNaN(date.getTime())) {
        return { error: 'Date invalide' };
    }

    if (!typeId) {
        return { error: 'Type d\'énergie requis' };
    }

    try {
        await prisma.consommation.create({
            data: {
                userId: user.id,
                date,
                valeur,
                cout,
                typeId
            }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error('Error adding consumption:', e);
        return { error: 'Erreur lors de l\'ajout de la consommation' };
    }
}
