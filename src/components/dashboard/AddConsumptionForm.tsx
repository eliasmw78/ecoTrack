'use client';

import React, { useState } from 'react';
import { addConsumption, updateConsumption } from '@/app/dashboard/actions';
import { Loader2, CheckCircle2, AlertCircle, Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TypeEnergie {
    id: number;
    libelle: string;
    unite: string;
}

interface InitialData {
    id: number;
    date: string;       // format YYYY-MM-DD
    typeId: number;
    valeur: number;
    cout: number;
    factureUrl?: string | null;
}

interface AddConsumptionFormProps {
    types: TypeEnergie[];
    initialData?: InitialData;
}

export function AddConsumptionForm({ types, initialData }: AddConsumptionFormProps) {
    const isEditMode = !!initialData;
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const defaultType = initialData
        ? types.find(t => t.id === initialData.typeId) || types[0]
        : types[0];
    const [selectedType, setSelectedType] = useState<TypeEnergie | null>(defaultType || null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setIsPending(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(form);

        const result = isEditMode
            ? await updateConsumption(initialData!.id, formData)
            : await addConsumption(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);

            if (isEditMode) {
                // Rediriger vers la liste après modification
                setTimeout(() => router.push('/dashboard/consommations'), 1000);
            } else {
                form.reset();
                const dateInput = form.querySelector('input[name="date"]') as HTMLInputElement;
                if (dateInput) dateInput.valueAsDate = new Date();
                setTimeout(() => setSuccess(false), 3000);
            }
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
                <h2 className="text-xl font-semibold text-dark-bg">
                    {isEditMode ? 'Modifier la saisie' : 'Nouvelle saisie'}
                </h2>
                {success && (
                    <div className="flex items-center gap-2 text-eco-green text-sm font-medium animate-in fade-in transition-all">
                        <CheckCircle2 size={16} />
                        {isEditMode ? 'Mis à jour !' : 'Enregistré !'}
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
                        defaultValue={initialData?.date || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Type Field */}
                <div className="space-y-1">
                    <label htmlFor="typeId" className="block text-sm font-medium text-gray-700">Type d&apos;énergie</label>
                    <select
                        name="typeId"
                        id="typeId"
                        required
                        defaultValue={initialData?.typeId}
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
                            defaultValue={initialData?.valeur}
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
                            defaultValue={initialData?.cout}
                            placeholder="0.00"
                            className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-sm font-medium">
                            €
                        </span>
                    </div>
                </div>

                {/* Justificatif */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Justificatif</label>
                    {isEditMode && initialData?.factureUrl && !fileName && (
                        <div className="flex items-center gap-2 text-sm text-tech-blue mb-1">
                            <a href={initialData.factureUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-tech-blue/80">
                                Fichier actuel ↗
                            </a>
                        </div>
                    )}
                    <label
                        htmlFor="facture"
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-eco-green hover:bg-eco-green/5 transition-all text-sm text-gray-500"
                    >
                        <Paperclip className="w-4 h-4" />
                        <span>{fileName || (isEditMode ? 'Remplacer le justificatif (PDF ou image, max 5 Mo)' : 'Joindre un justificatif (PDF ou image, max 5 Mo)')}</span>
                    </label>
                    <input
                        type="file"
                        name="facture"
                        id="facture"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setFileName(file ? file.name : null);
                        }}
                    />
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
                            {isEditMode ? 'Mise à jour...' : 'Ajout...'}
                        </>
                    ) : (
                        isEditMode ? 'Mettre à jour' : 'Ajouter'
                    )}
                </button>
            </form>
        </div>
    );
}
