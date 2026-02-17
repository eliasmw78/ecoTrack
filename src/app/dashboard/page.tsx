import React from 'react';
import { Zap, Flame, Droplets } from 'lucide-react';
import { getEnergyTypes, getChartData } from './actions';
import { AddConsumptionForm } from '@/components/dashboard/AddConsumptionForm';
import { ExpensesChart } from '@/components/dashboard/ExpensesChart';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

async function getDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Calcul des totaux par type d'énergie
    const stats = await prisma.consommation.groupBy({
        by: ['typeId'],
        _sum: {
            cout: true,
        },
        where: {
            userId: user.id
        }
    });

    // 2. Récupération des types pour mapper ID -> Libelle
    const types = await prisma.typeEnergie.findMany();

    // Helper pour récupérer le total par libellé
    const getTotal = (libelle: string) => {
        const type = types.find(t => t.libelle === libelle);
        if (!type) return 0;
        const stat = stats.find(s => s.typeId === type.id);
        return stat?._sum.cout || 0;
    }

    // 3. Récupération de l'historique (5 derniers)
    const history = await prisma.consommation.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 5,
        include: { typeEnergie: true }
    });

    return {
        elec: getTotal('Électricité'),
        gaz: getTotal('Gaz'),
        eau: getTotal('Eau'),
        history,
        energyTypes: types // On retourne aussi les types pour le formulaire
    };
}

export default async function DashboardPage() {
    const data = await getDashboardStats();
    const chartData = await getChartData();

    // Fallback safe si user non connecté (géré par layout mais bon)
    if (!data) return null;

    const { elec, gaz, eau, history, energyTypes } = data;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dark-bg">Tableau de bord</h1>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI 1: Électricité */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-warning-orange flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Dépense Élec.</p>
                        <p className="text-3xl font-bold text-dark-bg mt-2">{elec.toFixed(2)} €</p>
                    </div>
                    <div className="p-3 bg-warning-orange/10 rounded-full text-warning-orange">
                        <Zap size={24} />
                    </div>
                </div>

                {/* KPI 2: Gaz */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-alert-red flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Dépense Gaz</p>
                        <p className="text-3xl font-bold text-dark-bg mt-2">{gaz.toFixed(2)} €</p>
                    </div>
                    <div className="p-3 bg-alert-red/10 rounded-full text-alert-red">
                        <Flame size={24} />
                    </div>
                </div>

                {/* KPI 3: Eau */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-tech-blue flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Dépense Eau</p>
                        <p className="text-3xl font-bold text-dark-bg mt-2">{eau.toFixed(2)} €</p>
                    </div>
                    <div className="p-3 bg-tech-blue/10 rounded-full text-tech-blue">
                        <Droplets size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Graph + Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne Gauche (2/3) : Graphique Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-dark-bg mb-4">Évolution des dépenses</h3>
                    <ExpensesChart data={chartData} />
                </div>

                {/* Colonne Droite (1/3) : Formulaire d'ajout */}
                <div className="lg:col-span-1">
                    <AddConsumptionForm types={energyTypes} />
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-dark-bg">Historique des Factures</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Conso.</th>
                                <th className="px-6 py-4 text-right">Prix</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        Aucune facture enregistrée.
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {item.date.toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${item.typeEnergie.libelle === 'Électricité' ? 'bg-warning-orange/10 text-warning-orange' : ''}
                                                ${item.typeEnergie.libelle === 'Gaz' ? 'bg-alert-red/10 text-alert-red' : ''}
                                                ${item.typeEnergie.libelle === 'Eau' ? 'bg-tech-blue/10 text-tech-blue' : ''}
                                            `}>
                                                {item.typeEnergie.libelle}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.valeur} {item.typeEnergie.unite}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-dark-bg">
                                            {item.cout.toFixed(2)} €
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
