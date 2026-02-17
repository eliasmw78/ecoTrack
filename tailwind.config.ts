import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'eco-green': '#2ECC71',
                'tech-blue': '#3498DB',
                'alert-red': '#E74C3C',
                'warning-orange': '#F1C40F',
                'dark-bg': '#2C3E50',
                'light-bg': '#F4F6F7',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
