import React from 'react';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { AddConsumptionForm } from '@/components/dashboard/AddConsumptionForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditConsommationPage({ params }: PageProps) {
    const { id } = await params;
    const consommationId = parseInt(id);

    if (isNaN(consommationId)) {
        notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Récupérer la consommation
    const consommation = await prisma.consommation.findUnique({
        where: { id: consommationId },
        include: { typeEnergie: true },
    });

    if (!consommation || consommation.userId !== user.id) {
        notFound();
    }

    // Récupérer les types d'énergie pour le formulaire
    const types = await prisma.typeEnergie.findMany({
        select: { id: true, libelle: true, unite: true },
        orderBy: { libelle: 'asc' },
    });

    const initialData = {
        id: consommation.id,
        date: consommation.date.toISOString().split('T')[0],
        typeId: consommation.typeId,
        valeur: consommation.valeur,
        cout: consommation.cout,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-bg">Modifier la consommation</h1>
                    <p className="text-gray-500 mt-1">
                        Mise à jour de l&apos;enregistrement du {consommation.date.toLocaleDateString('fr-FR')} — {consommation.typeEnergie.libelle}
                    </p>
                </div>
                <Link
                    href="/dashboard/consommations"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-dark-bg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
            </div>

            {/* Formulaire */}
            <div className="max-w-lg">
                <AddConsumptionForm types={types} initialData={initialData} />
            </div>
        </div>
    );
}
