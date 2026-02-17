import React from 'react';
import { Zap, Euro, PieChart } from 'lucide-react';
import { getEnergyTypes } from './actions';
import { AddConsumptionForm } from '@/components/dashboard/AddConsumptionForm';

export default async function DashboardPage() {
    // Récupération des données côté serveur
    const types = await getEnergyTypes();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-dark-bg">Tableau de bord</h1>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI 1: Consommation */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-eco-green flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Consommation ce mois</p>
                        <p className="text-3xl font-bold text-dark-bg mt-2">0 kWh</p>
                    </div>
                    <div className="p-3 bg-eco-green/10 rounded-full text-eco-green">
                        <Zap size={24} />
                    </div>
                </div>

                {/* KPI 2: Coût estimé */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-tech-blue flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Coût estimé</p>
                        <p className="text-3xl font-bold text-dark-bg mt-2">0 €</p>
                    </div>
                    <div className="p-3 bg-tech-blue/10 rounded-full text-tech-blue">
                        <Euro size={24} />
                    </div>
                </div>

                {/* KPI 3: Type dominant */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-300 flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Type dominant</p>
                        <p className="text-3xl font-bold text-dark-bg mt-2">-</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                        <PieChart size={24} />
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Graph + Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne Gauche (2/3) : Graphique Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 min-h-[400px] flex items-center justify-center border border-gray-100">
                    <div className="text-center">
                        <div className="bg-gray-50 inline-flex p-4 rounded-full mb-4">
                            <PieChart className="text-gray-300" size={48} />
                        </div>
                        <p className="text-gray-400 font-medium text-lg">Graphique d'évolution à venir</p>
                    </div>
                </div>

                {/* Colonne Droite (1/3) : Formulaire d'ajout */}
                <div className="lg:col-span-1">
                    <AddConsumptionForm types={types} />
                </div>
            </div>
        </div>
    );
}
