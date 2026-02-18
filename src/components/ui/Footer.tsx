import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-center sm:text-left">
                        © {new Date().getFullYear()} <span className="text-white font-medium">EcoTrack</span>. Tous droits réservés.
                    </p>

                    {/* Liens */}
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            href="/legal/mentions-legales"
                            className="hover:text-white transition-colors"
                        >
                            Mentions Légales
                        </Link>
                        <Link
                            href="/legal/confidentialite"
                            className="hover:text-white transition-colors"
                        >
                            Confidentialité
                        </Link>
                        <a
                            href="mailto:contact@ecotrack.fr"
                            className="hover:text-white transition-colors"
                        >
                            Contact
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
