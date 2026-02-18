import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
    title: 'Politique de Confidentialité — EcoTrack',
};

export default function ConfidentialitePage() {
    return (
        <div className="min-h-screen bg-light-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Bouton retour */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-eco-green transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Retour
                </Link>

                {/* En-tête */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-tech-blue/10 rounded-xl text-tech-blue">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-dark-bg">Politique de Confidentialité</h1>
                        <p className="text-sm text-gray-400 mt-1">Dernière mise à jour : 18 février 2026</p>
                    </div>
                </div>

                {/* Contenu */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">1. Données collectées</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Dans le cadre de l&apos;utilisation d&apos;EcoTrack, nous collectons les données personnelles suivantes :
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            <li>Adresse e-mail</li>
                            <li>Nom et prénom</li>
                            <li>Données de consommation énergétique (électricité, gaz, eau)</li>
                            <li>Justificatifs de factures (si fournis)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">2. Finalité du traitement</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Les données collectées sont utilisées exclusivement pour permettre le <strong>suivi personnel de votre budget énergétique</strong>.
                            Elles ne sont ni vendues, ni partagées avec des tiers à des fins commerciales.
                            Aucun profilage publicitaire n&apos;est effectué.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">3. Stockage et sécurité</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Vos données sont stockées de manière sécurisée sur les serveurs de <strong>Supabase</strong>, hébergés au sein de l&apos;<strong>Union Européenne</strong>.
                            Les communications sont chiffrées via HTTPS et l&apos;authentification est gérée par un système sécurisé conforme aux standards de l&apos;industrie.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">4. Cookies</h2>
                        <p className="text-gray-600 leading-relaxed">
                            EcoTrack utilise uniquement des <strong>cookies essentiels</strong> nécessaires au fonctionnement de l&apos;application
                            (authentification et maintien de session). Aucun cookie publicitaire ou de suivi n&apos;est utilisé.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">5. Vos droits</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                        </p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                            <li><strong>Droit d&apos;accès</strong> : consulter vos données personnelles à tout moment depuis votre profil.</li>
                            <li><strong>Droit de rectification</strong> : modifier vos informations personnelles depuis votre profil.</li>
                            <li><strong>Droit de suppression</strong> : supprimer votre compte et l&apos;intégralité de vos données depuis la page Profil.</li>
                            <li><strong>Droit de portabilité</strong> : demander l&apos;export de vos données par e-mail.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">6. Contact</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Pour toute question relative à vos données personnelles, vous pouvez nous contacter à l&apos;adresse suivante :
                        </p>
                        <a
                            href="mailto:contact@ecotrack.fr"
                            className="inline-flex items-center gap-2 mt-2 text-tech-blue hover:underline font-medium"
                        >
                            contact@ecotrack.fr
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
