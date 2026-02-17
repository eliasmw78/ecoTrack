import React from 'react';
import { Zap, Flame, Droplets, FileText, ArrowLeft, Pencil, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { DeleteButton } from '@/components/dashboard/DeleteButton';
import { ConsumptionFilters } from '@/components/dashboard/ConsumptionFilters';

async function getConsommations(filters: { type?: string; year?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: user.id };

    // Filtre par type d'énergie
    if (filters.type) {
        where.typeEnergie = { libelle: filters.type };
    }

    // Filtre par année
    if (filters.year) {
        const year = parseInt(filters.year);
        where.date = {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
        };
    }

    return prisma.consommation.findMany({
        where,
        orderBy: { date: 'asc' },
        include: { typeEnergie: true },
    });
}

// Calcul de la variation par rapport à la facture précédente du même type
interface ConsommationWithVariation {
    id: number;
    date: Date;
    valeur: number;
    cout: number;
    typeId: number;
    userId: string;
    typeEnergie: { id: number; libelle: string; unite: string };
    variation: number | null;
}

function computeVariations(data: { id: number; date: Date; valeur: number; cout: number; typeId: number; userId: string; typeEnergie: { id: number; libelle: string; unite: string } }[]): ConsommationWithVariation[] {
    // data est trié par date ASC
    const lastByType = new Map<number, number>(); // typeId -> dernier coût

    const withVariation = data.map((item) => {
        const previousCost = lastByType.get(item.typeId);
        let variation: number | null = null;

        if (previousCost !== undefined && previousCost !== 0) {
            variation = ((item.cout - previousCost) / previousCost) * 100;
        }

        lastByType.set(item.typeId, item.cout);

        return { ...item, variation };
    });

    // Inverser pour affichage descendant (plus récent en haut)
    return withVariation.reverse();
}

// Icône en fonction du type d'énergie
function EnergyIcon({ libelle }: { libelle: string }) {
    switch (libelle) {
        case 'Électricité':
            return <Zap className="w-4 h-4 text-warning-orange" />;
        case 'Gaz':
            return <Flame className="w-4 h-4 text-alert-red" />;
        case 'Eau':
            return <Droplets className="w-4 h-4 text-tech-blue" />;
        default:
            return <FileText className="w-4 h-4 text-gray-400" />;
    }
}

// Badge couleur en fonction du type
function typeBadgeClass(libelle: string) {
    switch (libelle) {
        case 'Électricité':
            return 'bg-warning-orange/10 text-warning-orange';
        case 'Gaz':
            return 'bg-alert-red/10 text-alert-red';
        case 'Eau':
            return 'bg-tech-blue/10 text-tech-blue';
        default:
            return 'bg-gray-100 text-gray-600';
    }
}

interface PageProps {
    searchParams: Promise<{ type?: string; year?: string }>;
}

export default async function ConsommationsPage({ searchParams }: PageProps) {
    const filters = await searchParams;
    const raw = await getConsommations(filters);
    const consommations = computeVariations(raw);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-bg">Mes Consommations</h1>
                    <p className="text-gray-500 mt-1">
                        Historique complet de vos consommations d&apos;énergie
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-eco-green text-white font-medium text-sm hover:bg-eco-green/90 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour au Dashboard
                </Link>
            </div>

            {/* Filtres */}
            <ConsumptionFilters />

            {/* Contenu */}
            {consommations.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-eco-green/10 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-eco-green" />
                    </div>
                    <h2 className="text-xl font-semibold text-dark-bg mb-2">
                        Aucune consommation pour le moment
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Commencez par ajouter votre première consommation d&apos;énergie
                        pour suivre vos dépenses et votre impact environnemental.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-eco-green text-white font-semibold hover:bg-eco-green/90 transition-colors shadow-md hover:shadow-lg"
                    >
                        <Zap className="w-5 h-5" />
                        Ajouter une consommation
                    </Link>
                </div>
            ) : (
                /* Tableau */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold text-dark-bg">{consommations.length}</span> consommation{consommations.length > 1 ? 's' : ''} enregistrée{consommations.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80">
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Consommation
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                        Coût
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                        Variation
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {consommations.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Date */}
                                        <td className="px-6 py-4 font-medium text-dark-bg whitespace-nowrap">
                                            {item.date.toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>

                                        {/* Type */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeBadgeClass(item.typeEnergie.libelle)}`}>
                                                <EnergyIcon libelle={item.typeEnergie.libelle} />
                                                {item.typeEnergie.libelle}
                                            </span>
                                        </td>

                                        {/* Consommation */}
                                        <td className="px-6 py-4 text-gray-700">
                                            <span className="font-semibold">{item.valeur}</span>{' '}
                                            <span className="text-gray-400 text-sm">{item.typeEnergie.unite}</span>
                                        </td>

                                        {/* Coût */}
                                        <td className="px-6 py-4 text-right font-semibold text-dark-bg">
                                            {item.cout.toFixed(2)} €
                                        </td>

                                        {/* Variation */}
                                        <td className="px-6 py-4 text-right">
                                            {item.variation === null ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                    <Minus className="w-3 h-3" />
                                                    N/A
                                                </span>
                                            ) : item.variation > 0 ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-alert-red">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    +{item.variation.toFixed(1)}%
                                                </span>
                                            ) : item.variation < 0 ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-eco-green">
                                                    <TrendingDown className="w-3.5 h-3.5" />
                                                    {item.variation.toFixed(1)}%
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                    <Minus className="w-3 h-3" />
                                                    0%
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <Link
                                                    href={`/dashboard/consommations/${item.id}`}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-tech-blue hover:bg-tech-blue/10 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <DeleteButton id={item.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
