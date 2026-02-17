'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function ConsumptionFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const currentType = searchParams.get('type') || '';
    const currentYear = searchParams.get('year') || '';

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Filtre par type */}
            <div className="flex items-center gap-2">
                <label htmlFor="filter-type" className="text-sm font-medium text-gray-500">
                    Type
                </label>
                <select
                    id="filter-type"
                    value={currentType}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className="border border-gray-200 rounded-lg p-2 text-sm bg-white text-dark-bg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                >
                    <option value="">Tous</option>
                    <option value="Électricité">Électricité</option>
                    <option value="Gaz">Gaz</option>
                    <option value="Eau">Eau</option>
                </select>
            </div>

            {/* Filtre par année */}
            <div className="flex items-center gap-2">
                <label htmlFor="filter-year" className="text-sm font-medium text-gray-500">
                    Année
                </label>
                <select
                    id="filter-year"
                    value={currentYear}
                    onChange={(e) => updateFilter('year', e.target.value)}
                    className="border border-gray-200 rounded-lg p-2 text-sm bg-white text-dark-bg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                >
                    <option value="">Toutes</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                </select>
            </div>

            {/* Bouton Reset */}
            {(currentType || currentYear) && (
                <button
                    onClick={() => router.push(pathname)}
                    className="text-sm text-gray-400 hover:text-alert-red transition-colors underline underline-offset-2"
                >
                    Réinitialiser
                </button>
            )}
        </div>
    );
}
