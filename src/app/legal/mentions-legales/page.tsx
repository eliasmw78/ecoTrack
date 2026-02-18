import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export const metadata = {
    title: 'Mentions Légales — EcoTrack',
};

export default function MentionsLegalesPage() {
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
                    <div className="p-3 bg-eco-green/10 rounded-xl text-eco-green">
                        <Scale size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-dark-bg">Mentions Légales</h1>
                        <p className="text-sm text-gray-400 mt-1">Dernière mise à jour : 18 février 2026</p>
                    </div>
                </div>

                {/* Contenu */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">1. Éditeur du site</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Le site <strong>EcoTrack</strong> est un projet étudiant réalisé dans le cadre d&apos;un examen académique.
                        </p>
                        <ul className="list-none text-gray-600 mt-3 space-y-1.5">
                            <li><strong>Éditeur :</strong> Elias M. (Projet Étudiant)</li>
                            <li><strong>Statut :</strong> Projet universitaire — non commercial</li>
                            <li><strong>Contact :</strong>{' '}
                                <a href="mailto:contact@ecotrack.fr" className="text-tech-blue hover:underline">
                                    contact@ecotrack.fr
                                </a>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">2. Hébergement</h2>
                        <p className="text-gray-600 leading-relaxed">Le site est hébergé par :</p>
                        <ul className="list-none text-gray-600 mt-3 space-y-1.5">
                            <li><strong>Application :</strong> Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                            <li><strong>Base de données & Authentification :</strong> Supabase Inc. — San Francisco, CA, USA (serveurs UE)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">3. Propriété intellectuelle</h2>
                        <p className="text-gray-600 leading-relaxed">
                            L&apos;ensemble du contenu du site EcoTrack (code source, design, textes, graphiques) est réalisé dans le cadre
                            d&apos;un <strong>projet d&apos;examen</strong>. Toute reproduction ou utilisation à des fins commerciales sans
                            autorisation préalable est interdite.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">4. Responsabilité</h2>
                        <p className="text-gray-600 leading-relaxed">
                            L&apos;éditeur s&apos;efforce de fournir des informations exactes et à jour. Toutefois, il ne saurait être tenu
                            responsable des erreurs, d&apos;omissions ou des résultats qui pourraient être obtenus par un mauvais usage
                            de ces informations. Ce site est fourni <strong>en l&apos;état</strong>, à titre informatif et éducatif.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-dark-bg mb-3">5. Protection des données</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Pour en savoir plus sur la collecte et le traitement de vos données personnelles, veuillez consulter notre{' '}
                            <Link href="/legal/confidentialite" className="text-tech-blue hover:underline font-medium">
                                Politique de Confidentialité
                            </Link>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
