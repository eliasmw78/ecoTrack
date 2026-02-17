'use client';

import React, { useState } from 'react';
import { addConsumption } from '@/app/dashboard/actions';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TypeEnergie {
    id: number;
    libelle: string;
    unite: string;
}

interface AddConsumptionFormProps {
    types: TypeEnergie[];
}

export function AddConsumptionForm({ types }: AddConsumptionFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<TypeEnergie | null>(types[0] || null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget; // Capture form reference immediately
        setIsPending(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(form);
        const result = await addConsumption(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            form.reset();
            // Keep selected type or reset? Let's keep it.
            // Reset Default Date
            const dateInput = form.querySelector('input[name="date"]') as HTMLInputElement;
            if (dateInput) dateInput.valueAsDate = new Date();

            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        }
        setIsPending(false);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const typeId = parseInt(e.target.value);
        const type = types.find(t => t.id === typeId);
        setSelectedType(type || null);
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-dark-bg">Nouvelle saisie</h2>
                {success && (
                    <div className="flex items-center gap-2 text-eco-green text-sm font-medium animate-in fade-in transition-all">
                        <CheckCircle2 size={16} />
                        Enregistré !
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date Field */}
                <div className="space-y-1">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Type Field */}
                <div className="space-y-1">
                    <label htmlFor="typeId" className="block text-sm font-medium text-gray-700">Type d'énergie</label>
                    <select
                        name="typeId"
                        id="typeId"
                        required
                        onChange={handleTypeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all bg-white"
                    >
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.libelle}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Value Field */}
                <div className="space-y-1">
                    <label htmlFor="valeur" className="block text-sm font-medium text-gray-700">Consommation</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="valeur"
                            id="valeur"
                            step="0.1"
                            min="0"
                            required
                            placeholder="0.0"
                            className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-sm font-medium">
                            {selectedType?.unite || ''}
                        </span>
                    </div>
                </div>

                {/* Cost Field */}
                <div className="space-y-1">
                    <label htmlFor="cout" className="block text-sm font-medium text-gray-700">Montant de la facture (€)</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="cout"
                            id="cout"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-sm font-medium">
                            €
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-alert-red text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-eco-green text-white font-medium py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            Ajout...
                        </>
                    ) : (
                        'Ajouter'
                    )}
                </button>
            </form>
        </div>
    );
}
