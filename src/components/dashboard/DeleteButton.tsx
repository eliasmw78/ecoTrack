'use client';

import { Trash2 } from 'lucide-react';
import { deleteConsumption } from '@/app/dashboard/actions';
import { useState } from 'react';

export function DeleteButton({ id }: { id: number }) {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette consommation ?')) {
            return;
        }

        setIsPending(true);
        const result = await deleteConsumption(id);

        if (result.error) {
            alert(result.error);
        }

        setIsPending(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-alert-red hover:bg-alert-red/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Supprimer"
        >
            <Trash2 className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
        </button>
    );
}
