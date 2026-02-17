import React from 'react';
import { Zap, Flame, Droplets, FileText, TrendingUp, TrendingDown, Minus, Wallet, Calendar, Calculator, Award, Plus } from 'lucide-react';
import { getEnergyTypes, getChartData } from './actions';
import { AddConsumptionForm } from '@/components/dashboard/AddConsumptionForm';
import { ExpensesChart } from '@/components/dashboard/ExpensesChart';
import { DistributionChart } from '@/components/dashboard/DistributionChart';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Mois en cours
    const currentStats = await prisma.consommation.groupBy({
        by: ['typeId'],
        _sum: { cout: true },
        where: {
            userId: user.id,
            date: { gte: currentMonthStart, lt: nextMonthStart },
        },
    });

    // Mois précédent
    const prevStats = await prisma.consommation.groupBy({
        by: ['typeId'],
        _sum: { cout: true },
        where: {
            userId: user.id,
            date: { gte: prevMonthStart, lt: currentMonthStart },
        },
    });

    const types = await prisma.typeEnergie.findMany();

    const getMonthly = (libelle: string) => {
        const type = types.find(t => t.libelle === libelle);
        if (!type) return { current: 0, previous: 0, variation: null as number | null };

        const cur = currentStats.find(s => s.typeId === type.id)?._sum.cout || 0;
        const prev = prevStats.find(s => s.typeId === type.id)?._sum.cout || 0;

        let variation: number | null = null;
        if (prev > 0) {
            variation = ((cur - prev) / prev) * 100;
        }

        return { current: cur, previous: prev, variation };
    };

    const history = await prisma.consommation.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 5,
        include: { typeEnergie: true },
    });

    // Calculs annuels
    const annualConsumptions = await prisma.consommation.findMany({
        where: {
            userId: user.id,
            date: { gte: yearStart },
        },
        select: { date: true, cout: true }
    });

    const totalAnnual = annualConsumptions.reduce((acc, curr) => acc + curr.cout, 0);
    const monthsPassed = now.getMonth() + 1;
    const monthlyAverage = totalAnnual / monthsPassed;

    const expensesByMonth = new Array(12).fill(0);
    annualConsumptions.forEach(c => {
        const monthIndex = new Date(c.date).getMonth();
        expensesByMonth[monthIndex] += c.cout;
    });

    const maxMonthIndex = expensesByMonth.indexOf(Math.max(...expensesByMonth));
    const maxMonthValue = expensesByMonth[maxMonthIndex];
    const maxMonthName = new Date(now.getFullYear(), maxMonthIndex, 1).toLocaleString('fr-FR', { month: 'long' });

    const elec = getMonthly('Électricité');
    const gaz = getMonthly('Gaz');
    const eau = getMonthly('Eau');

    const curElec = elec.current;
    const curGas = gaz.current;
    const curWater = eau.current;

    const totalGlobal = curElec + curGas + curWater;

    const distributionData = [
        { name: 'Électricité', value: curElec, color: '#3498DB' },
        { name: 'Gaz', value: curGas, color: '#F1C40F' },
        { name: 'Eau', value: curWater, color: '#2ECC71' },
    ]
        .filter(d => d.value > 0)
        .map(d => ({
            ...d,
            percentage: totalGlobal > 0 ? ((d.value / totalGlobal) * 100).toFixed(1) : '0'
        }));

    const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const currentMonthName = now.toLocaleString('fr-FR', { month: 'long' });
    const previousMonthName = prevMonthStart.toLocaleString('fr-FR', { month: 'long' });
    const currentYear = now.getFullYear();

    return {
        elec,
        gaz,
        eau,
        totalGlobal,
        pieChartData: distributionData,
        history,
        energyTypes: types,
        monthLabel,
        currentMonthName,
        previousMonthName,
        annualStats: {
            total: totalAnnual,
            average: monthlyAverage,
            maxMonth: { name: capitalize(maxMonthName), value: maxMonthValue }
        },
        currentYear
    };
}

function VariationBadge({ variation, previousMonthName }: { variation: number | null; previousMonthName: string }) {
    if (variation === null) {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                <Minus className="w-3 h-3" /> Pas de données
            </span>
        );
    }
    if (variation > 0) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-alert-red bg-alert-red/10 px-2 py-0.5 rounded-full mt-1">
                <TrendingUp className="w-3 h-3" /> +{variation.toFixed(1)}% vs {capitalize(previousMonthName)}
            </span>
        );
    }
    if (variation < 0) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-eco-green bg-eco-green/10 px-2 py-0.5 rounded-full mt-1">
                <TrendingDown className="w-3 h-3" /> {variation.toFixed(1)}% vs {capitalize(previousMonthName)}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
            <Minus className="w-3 h-3" /> 0% vs {capitalize(previousMonthName)}
        </span>
    );
}

export default async function DashboardPage() {
    const data = await getDashboardStats();
    const chartData = await getChartData();

    if (!data) return null;

    const { elec, gaz, eau, totalGlobal, pieChartData, monthLabel, currentMonthName, previousMonthName, history, energyTypes, annualStats, currentYear } = data;

    return (
        <div className="space-y-6 sm:space-y-8 pb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-bg">Tableau de bord</h1>

            {/* KPI Grid */}
            <p className="text-sm text-gray-500 -mb-2 sm:-mb-4 capitalize">{monthLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* KPI 1: Électricité */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-warning-orange flex items-start justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide">Dépense Élec. ({capitalize(currentMonthName)})</p>
                        <p className="text-2xl sm:text-3xl font-bold text-dark-bg mt-1 sm:mt-2">{elec.current.toFixed(2)} €</p>
                        <VariationBadge variation={elec.variation} previousMonthName={previousMonthName} />
                    </div>
                    <div className="p-3 bg-warning-orange/10 rounded-full text-warning-orange">
                        <Zap size={24} />
                    </div>
                </div>

                {/* KPI 2: Gaz */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-alert-red flex items-start justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide">Dépense Gaz ({capitalize(currentMonthName)})</p>
                        <p className="text-2xl sm:text-3xl font-bold text-dark-bg mt-1 sm:mt-2">{gaz.current.toFixed(2)} €</p>
                        <VariationBadge variation={gaz.variation} previousMonthName={previousMonthName} />
                    </div>
                    <div className="p-3 bg-alert-red/10 rounded-full text-alert-red">
                        <Flame size={24} />
                    </div>
                </div>

                {/* KPI 3: Eau */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-tech-blue flex items-start justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide">Dépense Eau ({capitalize(currentMonthName)})</p>
                        <p className="text-2xl sm:text-3xl font-bold text-dark-bg mt-1 sm:mt-2">{eau.current.toFixed(2)} €</p>
                        <VariationBadge variation={eau.variation} previousMonthName={previousMonthName} />
                    </div>
                    <div className="p-3 bg-tech-blue/10 rounded-full text-tech-blue">
                        <Droplets size={24} />
                    </div>
                </div>

                {/* KPI 4: Total Global */}
                <div className="bg-dark-bg rounded-xl shadow-sm p-4 sm:p-6 flex items-start justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide">Total ({capitalize(currentMonthName)})</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{totalGlobal.toFixed(2)} €</p>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1 capitalize">{monthLabel}</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-full text-eco-green">
                        <Wallet size={24} />
                    </div>
                </div>
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graphique d'évolution (2/3) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 min-w-0">
                    <h3 className="text-lg font-bold text-dark-bg mb-4">Évolution des dépenses</h3>
                    <ExpensesChart data={chartData} />
                </div>

                {/* Graphique de répartition (1/3) */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-dark-bg mb-4">Répartition des dépenses</h3>
                    <DistributionChart data={pieChartData} totalAmount={totalGlobal} />
                </div>
            </div>

            {/* Bottom Row: Annual & History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bilan Annuel (Gauche) */}
                <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-200">
                    <h3 className="text-lg font-bold text-dark-bg mb-6">Bilan {currentYear}</h3>
                    <div className="space-y-6">
                        {/* Total Annuel */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-eco-green">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Annuel</p>
                                <p className="text-2xl font-bold text-dark-bg">{annualStats.total.toFixed(2)} €</p>
                            </div>
                        </div>

                        {/* Moyenne Mensuelle */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-tech-blue">
                                <Calculator size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Moyenne Mensuelle</p>
                                <p className="text-2xl font-bold text-dark-bg">{annualStats.average.toFixed(2)} € / mois</p>
                            </div>
                        </div>

                        {/* Plus grosse dépense */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-warning-orange">
                                <Award size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Plus grosse dépense</p>
                                <p className="text-2xl font-bold text-dark-bg">{annualStats.maxMonth.value > 0 ? `${annualStats.maxMonth.name} - ${annualStats.maxMonth.value.toFixed(2)} €` : '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historique récent (Droite) */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h3 className="text-base sm:text-lg font-bold text-dark-bg">Historique récent</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Date</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Type</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Conso.</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Prix</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Doc</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            Aucune facture enregistrée.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium">
                                                {item.date.toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${item.typeEnergie.libelle === 'Électricité' ? 'bg-warning-orange/10 text-warning-orange' : ''}
                                                    ${item.typeEnergie.libelle === 'Gaz' ? 'bg-alert-red/10 text-alert-red' : ''}
                                                    ${item.typeEnergie.libelle === 'Eau' ? 'bg-tech-blue/10 text-tech-blue' : ''}
                                                `}>
                                                    {item.typeEnergie.libelle}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                {item.valeur} {item.typeEnergie.unite}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-dark-bg">
                                                {item.cout.toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.factureUrl ? (
                                                    <a
                                                        href={item.factureUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-tech-blue hover:bg-tech-blue/10 transition-colors"
                                                        title="Voir le justificatif"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer: Formulaire d'ajout */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-tech-blue/10 rounded-lg text-tech-blue">
                        <Plus className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-bg">Nouvelle Saisie</h3>
                </div>
                <AddConsumptionForm types={energyTypes} />
            </div>
        </div>
    );
}
