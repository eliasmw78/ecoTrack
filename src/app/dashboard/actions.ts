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

export async function deleteConsumption(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non authentifié' };
    }

    try {
        // Vérifier que l'utilisateur est le propriétaire
        const consommation = await prisma.consommation.findUnique({
            where: { id },
        });

        if (!consommation) {
            return { error: 'Consommation introuvable' };
        }

        if (consommation.userId !== user.id) {
            return { error: 'Accès refusé' };
        }

        await prisma.consommation.delete({
            where: { id },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/consommations');
        return { success: true };
    } catch (e) {
        console.error('Error deleting consumption:', e);
        return { error: 'Erreur lors de la suppression' };
    }
}

export async function updateConsumption(id: number, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Non authentifié' };
    }

    // Vérifier que l'utilisateur est le propriétaire
    const existing = await prisma.consommation.findUnique({
        where: { id },
    });

    if (!existing) {
        return { error: 'Consommation introuvable' };
    }

    if (existing.userId !== user.id) {
        return { error: 'Accès refusé' };
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
        await prisma.consommation.update({
            where: { id },
            data: {
                date,
                valeur,
                cout,
                typeId,
            },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/consommations');
        return { success: true };
    } catch (e) {
        console.error('Error updating consumption:', e);
        return { error: 'Erreur lors de la mise à jour' };
    }
}

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

export async function getChartData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Récupérer toutes les consommations avec le type d'énergie
    const consommations = await prisma.consommation.findMany({
        where: { userId: user.id },
        include: { typeEnergie: true },
        orderBy: { date: 'asc' },
    });

    if (consommations.length === 0) return [];

    // Grouper par mois + année
    const monthMap = new Map<string, { sortKey: number; name: string;[key: string]: number | string }>();

    for (const c of consommations) {
        const date = new Date(c.date);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${String(month).padStart(2, '0')}`;
        const label = `${MONTH_LABELS[month]} ${year}`;

        if (!monthMap.has(key)) {
            monthMap.set(key, { sortKey: year * 100 + month, name: label });
        }

        const entry = monthMap.get(key)!;
        const typeName = c.typeEnergie.libelle;
        entry[typeName] = ((entry[typeName] as number) || 0) + c.cout;
    }

    // Trier chronologiquement et retourner
    return Array.from(monthMap.values())
        .sort((a, b) => (a.sortKey as number) - (b.sortKey as number))
        .map(({ sortKey, ...rest }) => rest);
}
