'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('ecotrack-cookies-accepted');
        if (!accepted) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('ecotrack-cookies-accepted', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-dark-bg text-white rounded-xl shadow-lg border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-white/10 rounded-lg shrink-0 mt-0.5">
                        <Cookie size={20} className="text-warning-orange" />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Nous utilisons uniquement des <strong className="text-white">cookies essentiels</strong> pour assurer votre connexion sécurisée.
                        Aucun cookie publicitaire n&apos;est utilisé.{' '}
                        <a href="/legal/confidentialite" className="underline underline-offset-2 text-tech-blue hover:text-tech-blue/80 transition-colors">
                            En savoir plus
                        </a>
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                        onClick={handleAccept}
                        className="px-5 py-2 bg-eco-green text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Compris
                    </button>
                    <button
                        onClick={handleAccept}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                        aria-label="Fermer"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
