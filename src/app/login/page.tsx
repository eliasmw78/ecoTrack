'use client';

import React, { useState, useActionState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login, signup } from './actions';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Wrapper function to dispatch to the correct server action based on state
    const authAction = async (prevState: any, formData: FormData) => {
        if (isLogin) {
            return await login(formData);
        } else {
            return await signup(formData);
        }
    };

    const [state, formAction, isPending] = useActionState(authAction, null);

    // Form states for controlled inputs (optional, but good for UX clearing)
    // We can just rely on name attributes for FormData, but controlled inputs allows clearing error on change if desired.
    // For simplicity and to match previous code structure, we keep controlled inputs but FormData is what matters for the action.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [consentChecked, setConsentChecked] = useState(false);

    return (
        <div className="min-h-screen flex w-full">
            {/* Colonne Gauche - Formulaire (40%) */}
            <div className="w-full lg:w-[40%] bg-light-bg flex flex-col justify-center px-8 sm:px-12 lg:px-20 relative">
                <div className="absolute top-8 left-8">
                    <Logo size="md" />
                </div>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-bold text-dark-bg mb-2">
                        {isLogin ? 'Bon retour parmi nous' : 'Créer un compte'}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {isLogin
                            ? 'Gérez votre consommation simplement'
                            : 'Rejoignez EcoTrack pour optimiser vos dépenses'}
                    </p>

                    <form action={formAction} className="space-y-5">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Prénom"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Nom"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none transition-all"
                                required
                            />
                        </div>

                        {state?.error && (
                            <div className="text-alert-red text-sm text-center">
                                {state.error}
                            </div>
                        )}

                        {/* Case RGPD (inscription uniquement) */}
                        {!isLogin && (
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={consentChecked}
                                    onChange={(e) => setConsentChecked(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-eco-green focus:ring-eco-green accent-eco-green cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 leading-relaxed">
                                    J&apos;accepte la{' '}
                                    <Link
                                        href="/legal/confidentialite"
                                        target="_blank"
                                        className="text-tech-blue hover:underline font-medium"
                                    >
                                        Politique de Confidentialité
                                    </Link>{' '}
                                    et consens au traitement de mes données.
                                </span>
                            </label>
                        )}

                        <button
                            type="submit"
                            disabled={isPending || (!isLogin && !consentChecked)}
                            className="w-full bg-eco-green text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Chargement...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Se connecter' : "S'inscrire"}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                // Reset state/error when switching modes is conceptually nice but useActionState state persists until next action
                                // In a real app we might reset form values here too.
                            }}
                            className="text-sm text-gray-500 hover:text-eco-green transition-colors"
                        >
                            {isLogin
                                ? "Pas encore de compte ? S'inscrire"
                                : 'Déjà un compte ? Se connecter'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Colonne Droite - Illustration (60%) */}
            <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-dark-bg to-eco-green relative overflow-hidden items-center justify-center text-white p-12">
                <div className="absolute inset-0 bg-black/10" /> {/* Overlay subtil */}

                {/* Cercles décoratifs */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-eco-green/20 blur-3xl" />

                <div className="relative z-10 max-w-lg text-center">
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        "La meilleure énergie est celle que l'on ne consomme pas."
                    </h2>
                    <p className="text-lg text-white/80 font-light">
                        Suivez votre impact, réduisez vos factures et participez à l'effort collectif.
                    </p>
                </div>
            </div>
        </div>
    );
}
