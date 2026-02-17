'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateProfile, sendResetPasswordEmail } from './actions';

interface ProfileFormProps {
    email: string;
    prenom: string;
    nom: string;
}

export function ProfileForm({ email, prenom, nom }: ProfileFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [isResetPending, setIsResetPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        const result = await updateProfile(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setIsPending(false);
    };

    const handleResetPassword = async () => {
        setIsResetPending(true);
        setResetSuccess(false);

        const result = await sendResetPasswordEmail();

        if (result.error) {
            setError(result.error);
        } else {
            setResetSuccess(true);
            setTimeout(() => setResetSuccess(false), 5000);
        }
        setIsResetPending(false);
    };

    return (
        <div className="space-y-6">
            {/* Carte profil */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header avec avatar */}
                <div className="bg-gradient-to-r from-tech-blue to-eco-green px-6 py-8 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                        {initials}
                    </div>
                    <p className="text-white/80 text-sm mt-3">{email}</p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Email (read-only) */}
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Mail className="w-4 h-4" /> Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                            <Lock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400">L&apos;email ne peut pas être modifié ici</p>
                    </div>

                    {/* Prénom */}
                    <div className="space-y-1">
                        <label htmlFor="prenom" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4" /> Prénom
                        </label>
                        <input
                            type="text"
                            name="prenom"
                            id="prenom"
                            defaultValue={prenom}
                            required
                            minLength={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                            placeholder="Votre prénom"
                        />
                    </div>

                    {/* Nom */}
                    <div className="space-y-1">
                        <label htmlFor="nom" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4" /> Nom
                        </label>
                        <input
                            type="text"
                            name="nom"
                            id="nom"
                            defaultValue={nom}
                            required
                            minLength={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent outline-none transition-all"
                            placeholder="Votre nom"
                        />
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="text-alert-red text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-eco-green text-sm flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            Profil mis à jour avec succès !
                        </div>
                    )}

                    {/* Bouton sauvegarder */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-eco-green text-white font-medium py-2.5 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer les modifications'
                        )}
                    </button>
                </form>
            </div>

            {/* Section Sécurité */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h3 className="text-lg font-bold text-dark-bg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-tech-blue" />
                    Sécurité
                </h3>
                <p className="text-sm text-gray-500">
                    Pour modifier votre mot de passe, nous vous enverrons un email de réinitialisation sécurisé.
                </p>

                {resetSuccess && (
                    <div className="text-eco-green text-sm flex items-center gap-2 bg-eco-green/10 px-3 py-2 rounded-lg">
                        <CheckCircle2 size={16} />
                        Email de réinitialisation envoyé ! Vérifiez votre boîte mail.
                    </div>
                )}

                <button
                    onClick={handleResetPassword}
                    disabled={isResetPending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isResetPending ? (
                        <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Modifier mon mot de passe
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
