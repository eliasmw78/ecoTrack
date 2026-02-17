# EcoTrack - Suivi de Consommation Énergétique

## 🎯 Objectif du Projet
**EcoTrack** est une application web personnelle conçue pour suivre et analyser votre consommation énergétique au quotidien. Elle vous permet de visualiser vos dépenses en Électricité, Gaz et Eau, et de mieux comprendre vos habitudes de consommation pour réduire votre empreinte écologique et vos factures.

## 🛠️ Technologies Utilisées
Ce projet est construit avec une stack moderne et performante :

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Base de Données** : [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM** : [Prisma](https://www.prisma.io/)
- **Visualisation** : [Recharts](https://recharts.org/) (Graphiques de consommation)
- **Icônes** : [Lucide React](https://lucide.dev/)

## 🚀 Instructions de Lancement

Suivez ces étapes pour installer et lancer le projet localement.

### 1. Cloner le dépôt
```bash
git clone https://github.com/ton-username/ecoTrack.git
cd ecoTrack
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Dupliquez le fichier `.env.example` et renommez-le en `.env`.

```bash
cp .env.example .env
```

Remplissez ensuite les variables avec vos clés Supabase (disponibles dans *Project Settings > API*) :

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="votre_url_supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_cle_anon_publique"

# Prisma Database Connection
# URL du pooler de transaction (Port 6543)
DATABASE_URL="postgresql://postgres:[PASSWORD]@host:6543/postgres?pgbouncer=true"

# URL de connexion directe (Port 5432) pour les migrations
DIRECT_URL="postgresql://postgres:[PASSWORD]@host:5432/postgres"
```

### 4. Synchroniser la base de données
Poussez le schéma Prisma vers votre base de données Supabase et remplissez les données initiales (types d'énergie) :

```bash
npx prisma db push
npx prisma db seed
```

### 5. Lancer l'application
Démarrez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.
